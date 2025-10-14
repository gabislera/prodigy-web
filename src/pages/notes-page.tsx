import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNotes } from "@/hooks/use-notes";
import type { Note } from "@/types/notes";
import { AINotesDialog } from "@/components/notes/ai-notes-dialog";
import { NotesEditor } from "@/components/notes/notes-editor";
import { NotesHeader } from "@/components/notes/notes-header";
import { NotesList } from "@/components/notes/notes-list";

export function NotesPage() {
	const { notes, createNote, debouncedUpdateNote, deleteNote } = useNotes();
	const isMobile = useIsMobile();

	const [selectedNote, setSelectedNote] = useState<Note | null>(null);
	const [editContent, setEditContent] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
	const [showEditor, setShowEditor] = useState(false);

	const containerRef = useRef<HTMLTextAreaElement>(null);
	const aiGeneratedNoteId = useRef<string | null>(null);

	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: "http://localhost:3333/notes/ai",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
			},
		}),
	});

	// Filter notes based on search query
	const filteredNotes = useMemo(() => {
		return notes.filter(
			(note) =>
				note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				note.content.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [notes, searchQuery]);

	// Set the first note as selected when notes are loaded
	useEffect(() => {
		if (notes.length > 0 && !selectedNote) {
			const firstNote = notes[0];
			setSelectedNote(firstNote);
			setEditContent(firstNote.content);
		}
	}, [notes, selectedNote]);

	const updateNoteContent = useCallback(
		(content: string) => {
			if (!selectedNote) return;

			const title = content.split("\n")[0] || "Nova Nota";
			const updates = { content, title };

			// Update local state immediately
			setSelectedNote((prev) => (prev ? { ...prev, ...updates } : null));

			// Auto-save to API with 1s debounce
			debouncedUpdateNote(selectedNote.id, updates);
		},
		[selectedNote, debouncedUpdateNote],
	);

	const handleCreateNote = useCallback(
		async (aiPrompt?: string) => {
			try {
				const newNote = await createNote({
					title: aiPrompt ? "Gerando com IA..." : "Nova nota",
					content: "",
				});

				// Clear any previous AI reference
				aiGeneratedNoteId.current = null;

				setSelectedNote(newNote);
				setEditContent("");

				// No mobile, mudar para a view do editor
				if (isMobile) {
					setShowEditor(true);
				}

				// If AI prompt provided, generate content
				if (aiPrompt) {
					aiGeneratedNoteId.current = newNote.id;
					sendMessage({ text: aiPrompt });
				}
			} catch (error) {
				console.error("Erro ao criar nota:", error);
				toast.error("Erro ao criar nota. Tente novamente.");
			}
		},
		[createNote, sendMessage, isMobile],
	);

	const handleBackToList = useCallback(() => {
		setShowEditor(false);
	}, []);

	const handleSelectNote = (note: Note) => {
		// Clear AI reference if switching to a different note
		if (aiGeneratedNoteId.current !== note.id) {
			aiGeneratedNoteId.current = null;
		}
		setSelectedNote(note);
		setEditContent(note.content);

		if (isMobile) {
			setShowEditor(true);
		}
	};

	const handleDeleteNote = useCallback(
		async (noteId: string) => {
			try {
				await deleteNote(noteId);

				// If the deleted note was selected, select another note
				if (selectedNote?.id === noteId) {
					const remainingNotes = notes.filter((note) => note.id !== noteId);
					if (remainingNotes.length > 0) {
						setSelectedNote(remainingNotes[0]);
						setEditContent(remainingNotes[0].content);
					} else {
						setSelectedNote(null);
						setEditContent("");

						if (isMobile) {
							setShowEditor(false);
						}
					}
				}
			} catch (error) {
				console.error("Erro ao deletar nota:", error);
				toast.error("Erro ao deletar nota. Tente novamente.");
			}
		},
		[deleteNote, selectedNote, notes, isMobile],
	);

	const handleContentChange = useCallback(
		(content: string) => {
			setEditContent(content);
			updateNoteContent(content);
		},
		[updateNoteContent],
	);

	// Consolidated AI logic effect
	useEffect(() => {
		const isAIGenerating = aiGeneratedNoteId.current === selectedNote?.id;

		// Handle AI content injection
		if (messages.length > 0 && selectedNote && isAIGenerating) {
			const lastAssistantMessage = messages
				.filter((message) => message.role === "assistant")
				.pop();

			if (lastAssistantMessage) {
				const textContent = lastAssistantMessage.parts
					.filter((part) => part.type === "text")
					.map((part) => part.text)
					.join("");

				if (textContent && textContent !== selectedNote.content) {
					setEditContent(textContent);
					const title = textContent.split("\n")[0] || "Nova Nota";

					// Update both local state and API optimistically
					setSelectedNote((prev) =>
						prev
							? { ...prev, content: textContent, title, updatedAt: new Date() }
							: null,
					);
					debouncedUpdateNote(selectedNote.id, {
						content: textContent,
						title,
					});
				}
			}
		}

		// Auto-scroll during streaming
		if (status === "streaming" && containerRef.current && isAIGenerating) {
			containerRef.current.scrollTo({
				top: containerRef.current.scrollHeight,
				behavior: "smooth",
			});
		}

		// Clear AI reference when streaming ends
		if (
			(status === "ready" || status === "error") &&
			aiGeneratedNoteId.current
		) {
			setTimeout(() => {
				aiGeneratedNoteId.current = null;
			}, 500);
		}
	}, [messages, status, selectedNote, debouncedUpdateNote]);

	return (
		<div className="flex flex-col h-[calc(100vh-60px)] md:h-[calc(100vh-80px)]">
			{/* Header - sempre visível */}
			<NotesHeader
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				onCreateNote={() => handleCreateNote()}
				onOpenAIDialog={() => setIsAIDialogOpen(true)}
				isAIGenerating={status === "submitted"}
				showBackButton={isMobile && showEditor && selectedNote !== null}
				onBackToList={handleBackToList}
			/>

			<div className="w-full flex flex-1 min-h-0">
				{/* Layout Desktop */}
				{!isMobile && (
					<>
						<NotesList
							notes={filteredNotes}
							selectedNote={selectedNote}
							onSelectNote={handleSelectNote}
							onDeleteNote={handleDeleteNote}
						/>

						<NotesEditor
							ref={containerRef}
							selectedNote={selectedNote}
							editContent={editContent}
							onContentChange={handleContentChange}
						/>
					</>
				)}

				{/* Layout Mobile */}
				{isMobile && !showEditor && (
					<NotesList
						notes={filteredNotes}
						selectedNote={selectedNote}
						onSelectNote={handleSelectNote}
						onDeleteNote={handleDeleteNote}
					/>
				)}

				{isMobile && showEditor && (
					<NotesEditor
						ref={containerRef}
						selectedNote={selectedNote}
						editContent={editContent}
						onContentChange={handleContentChange}
					/>
				)}
			</div>

			<AINotesDialog
				isOpen={isAIDialogOpen}
				onOpenChange={setIsAIDialogOpen}
				onCreateNote={(prompt) => handleCreateNote(prompt)}
			/>
		</div>
	);
}
