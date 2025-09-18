import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { Bot, Plus, Search, Send, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AINotesDialog } from "@/components/ai-notes-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface Note {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

export const Route = createFileRoute("/_protected/notes")({
	component: NotesPage,
});

const initialNote: Note = {
	id: new Date().toString(),
	title: "Nova nota",
	content: "",
	createdAt: new Date(),
	updatedAt: new Date(),
};

function NotesPage() {
	const [notes, setNotes] = useState<Note[]>([initialNote]);
	const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
	const [editContent, setEditContent] = useState(selectedNote?.content || "");
	const [searchQuery, setSearchQuery] = useState("");
	const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
	const [isChatOpen, setIsChatOpen] = useState(false);

	const containerRef = useRef<HTMLTextAreaElement>(null);
	const aiGeneratedNoteId = useRef<string | null>(null);

	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({ api: "http://localhost:3333/ai" }),
	});

	const updateNote = useCallback(
		(content: string) => {
			if (!selectedNote) return;

			const updatedNote = {
				...selectedNote,
				content,
				title: content.split("\n")[0] || "Nova Nota",
				updatedAt: new Date(),
			};

			setNotes((prev) =>
				prev.map((note) => (note.id === selectedNote.id ? updatedNote : note)),
			);
			setSelectedNote(updatedNote);
		},
		[selectedNote],
	);

	const createNewNote = () => {
		const newNote: Note = {
			id: Date.now().toString(),
			title: "Nova Nota",
			content: "",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		aiGeneratedNoteId.current = null; // Limpar referência da IA
		setNotes((prev) => [newNote, ...prev]);
		setSelectedNote(newNote);
		setEditContent("");
	};

	const createNoteWithAI = async (prompt: string) => {
		const newNote: Note = {
			id: Date.now().toString(),
			title: "",
			content: ``,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// Marcar esta nota como sendo gerada pela IA
		aiGeneratedNoteId.current = newNote.id;
		setNotes((prev) => [newNote, ...prev]);
		setSelectedNote(newNote);
		setEditContent(newNote.content);
		sendMessage({ text: prompt });
	};

	// console.log(messages, status);

	const filteredNotes = notes.filter(
		(note) =>
			note.title
				.toLocaleLowerCase()
				.includes(searchQuery.toLocaleLowerCase()) ||
			note.content
				.toLocaleLowerCase()
				.includes(searchQuery.toLocaleLowerCase()),
	);

	const selectNote = (note: Note) => {
		// Se não é a mesma nota que está sendo gerada pela IA, limpar a referência
		if (aiGeneratedNoteId.current !== note.id) {
			aiGeneratedNoteId.current = null;
		}
		setSelectedNote(note);
		setEditContent(note.content);
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	// Effect para injetar conteúdo da IA na textarea APENAS para a nota sendo gerada pela IA
	useEffect(() => {
		if (
			messages.length > 0 &&
			selectedNote &&
			aiGeneratedNoteId.current === selectedNote.id
		) {
			const lastAssistantMessage = messages
				.filter((message) => message.role === "assistant")
				.pop();

			if (lastAssistantMessage) {
				const textContent = lastAssistantMessage.parts
					.filter((part) => part.type === "text")
					.map((part) => part.text)
					.join("");

				// Só atualiza se há conteúdo de texto diferente do atual
				if (textContent && textContent !== selectedNote.content) {
					// Atualizar o editContent
					setEditContent(textContent);

					// Atualizar a nota
					const updatedNote = {
						...selectedNote,
						content: textContent,
						title: textContent.split("\n")[0] || "Nova Nota",
						updatedAt: new Date(),
					};

					setNotes((prev) =>
						prev.map((note) =>
							note.id === selectedNote.id ? updatedNote : note,
						),
					);
					setSelectedNote(updatedNote);
				}
			}
		}
	}, [messages, selectedNote]);

	useEffect(() => {
		if (messages.length > 0 && status === "streaming" && containerRef.current) {
			containerRef.current.scrollTo({
				top: containerRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messages, status]);

	// Effect para limpar a referência da IA quando o streaming terminar
	useEffect(() => {
		if (
			(status === "ready" || status === "error") &&
			aiGeneratedNoteId.current
		) {
			// Limpar a referência depois de um breve delay para permitir edição livre
			setTimeout(() => {
				aiGeneratedNoteId.current = null;
			}, 500);
		}
	}, [status]);

	return (
		<div className="flex flex-col h-[calc(100vh-80px)]">
			<div className="flex justify-between items-center p-4 border-b border-border/30 w-full bg-background">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
					<Input
						placeholder="Pesquisar notas..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
					/>
				</div>

				<div className="flex items-center justify-center gap-2">
					{status === "submitted" && (
						<Bot className="size-6 text-zinc-400 animate-pulse mr-2" />
					)}
					<Button
						onClick={createNewNote}
						size="sm"
						className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
						variant="outline"
					>
						<Plus className="w-4 h-4 mr-2" />
						Nova Nota
					</Button>
					<Button
						onClick={() => setIsAIDialogOpen(true)}
						size="sm"
						className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/20"
						variant="outline"
					>
						<Sparkles className="w-4 h-4 mr-2" />
						Gerar com IA
					</Button>
				</div>
			</div>

			<div className="w-full flex flex-1 min-h-0">
				<div className="w-72 border-r border-border/30 flex flex-col bg-background min-h-0">
					<div className="flex-1 overflow-y-auto py-2 min-h-0 scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent">
						{filteredNotes.length > 0 && (
							<div className="px-4 mb-4">
								<h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
									Hoje
								</h3>
								<div className="space-y-2">
									{filteredNotes.map((note) => (
										<button
											type="button"
											key={note.id}
											onClick={() => selectNote(note)}
											data-active={
												selectedNote?.id === note?.id ? "" : undefined
											}
											className="px-3 py-2 cursor-pointer transition-colors hover:bg-muted/30 rounded-md data-active:bg-muted/50 text-left w-full"
										>
											<h4 className="font-medium text-sm text-foreground mb-1 truncate">
												{note.title}
											</h4>
											<span className="text-xs text-muted-foreground block">
												{formatDate(note.updatedAt)}
											</span>
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="flex-1 bg-background min-h-0 flex flex-col">
					<Textarea
						ref={containerRef}
						value={editContent}
						onChange={(e) => {
							setEditContent(e.target.value);
							updateNote(e.target.value);
						}}
						className="min-w-full prose prose-invert prose-zinc flex-1 p-4 rounded-none resize-none border-none text-base leading-relaxed focus-visible:ring-0 font-normal overflow-y-auto scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent"
						placeholder="Comece a escrever..."
					/>
					{isChatOpen && selectedNote ? (
						<div className="p-4 border-t border-border/30">
							<div className="flex gap-2">
								<Input
									// value={aiChatMessage}
									// onChange={(e) => setAiChatMessage(e.target.value)}
									placeholder="Digite sua mensagem..."
									// onKeyPress={(e) => e.key === "Enter" && sendAIMessage()}
									className="flex-1"
								/>
								<Button size="sm">
									<Send className="w-4 h-4" />
								</Button>
								<Button
									onClick={() => setIsChatOpen(false)}
									size="sm"
									variant="ghost"
								>
									<X className="w-4 h-4" />
								</Button>
							</div>
						</div>
					) : (
						<Button
							onClick={() => setIsChatOpen(true)}
							size="lg"
							className="bg-purple-500/10 hover:bg-purple-500/20  border-purple-500/20 fixed bottom-4 right-4 rounded-full w-12 h-12"
							variant="outline"
						>
							<Bot className="size-6" />
						</Button>
					)}
				</div>
			</div>

			<AINotesDialog
				isOpen={isAIDialogOpen}
				onOpenChange={setIsAIDialogOpen}
				onCreateNote={createNoteWithAI}
			/>
		</div>
	);
}
