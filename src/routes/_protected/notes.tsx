import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { Plus, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { AINotesDialog } from "@/components/AINotesDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Note {
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

	const updateNote = (content: string) => {
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
	};

	const createNewNote = () => {
		const newNote: Note = {
			id: Date.now().toString(),
			title: "Nova Nota",
			content: "",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		setNotes((prev) => [newNote, ...prev]);
		setSelectedNote(newNote);
		setEditContent("");
	};

	const createNoteWithAI = async (instruction: string) => {
		// Criar nova nota instantaneamente
		const newNote: Note = {
			id: Date.now().toString(),
			title: "Gerando com IA...",
			content: `Aguarde, gerando conteúdo com IA...\n\nInstrução: ${instruction}`,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		setNotes((prev) => [newNote, ...prev]);
		setSelectedNote(newNote);
		setEditContent(newNote.content);

		try {
			const response = await axios.get("http://localhost:3333/");
			const aiContent = response.data.message.steps[0].content[0].text;

			const updatedNote = {
				...newNote,
				content: aiContent,
				title: aiContent.split("\n")[0] || "Nova nota gerada por IA",
				updatedAt: new Date(),
			};

			setNotes((prev) =>
				prev.map((note) => (note.id === newNote.id ? updatedNote : note)),
			);
			setSelectedNote(updatedNote);
			setEditContent(updatedNote.content);
		} catch (error) {
			console.error("Erro ao conectar com a API:", error);

			const errorNote = {
				...newNote,
				content: "Erro ao gerar conteúdo com IA. Tente novamente.",
				title: "Erro na geração",
				updatedAt: new Date(),
			};

			setNotes((prev) =>
				prev.map((note) => (note.id === newNote.id ? errorNote : note)),
			);
			setSelectedNote(errorNote);
			setEditContent(errorNote.content);
		}
	};

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

				<div className="flex gap-2">
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
											<h4 className="font-medium text-sm text-foreground mb-1">
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
						value={editContent}
						onChange={(e) => {
							setEditContent(e.target.value);
							updateNote(e.target.value);
						}}
						className="w-full flex-1 p-4 rounded-none resize-none border-none text-base leading-relaxed focus-visible:ring-0 font-normal overflow-y-auto scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent"
						placeholder="Comece a escrever..."
					/>
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
