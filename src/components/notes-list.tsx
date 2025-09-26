import { Trash2 } from "lucide-react";
import type { Note } from "@/services/notesService";

interface NotesListProps {
	notes: Note[];
	selectedNote: Note | null;
	onSelectNote: (note: Note) => void;
	onDeleteNote: (noteId: string) => void;
}

export function NotesList({
	notes,
	selectedNote,
	onSelectNote,
	onDeleteNote,
}: NotesListProps) {
	const formatDate = (date: Date | string) => {
		const dateObj = typeof date === "string" ? new Date(date) : date;
		return dateObj.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	if (notes.length === 0) {
		return (
			<div className="w-72 border-r border-border/30 flex flex-col bg-background min-h-0">
				<div className="flex-1 overflow-y-auto py-2 min-h-0 flex items-center justify-center">
					<p className="text-sm text-muted-foreground">
						Nenhuma nota encontrada
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-72 border-r border-border/30 flex flex-col bg-background min-h-0">
			<div className="flex-1 overflow-y-auto py-2 min-h-0 scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent">
				<div className="px-4 mb-4">
					<h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
						Hoje
					</h3>
					<div className="space-y-2">
						{notes.map((note) => (
							<button
								type="button"
								key={note.id}
								data-active={selectedNote?.id === note?.id ? "" : undefined}
								className="relative px-3 py-2 transition-colors hover:bg-muted/30 rounded-md data-active:bg-muted/50 group cursor-pointer w-full text-left"
								onClick={() => onSelectNote(note)}
							>
								<h4 className="font-medium text-sm text-foreground mb-1 truncate pr-8">
									{note.title}
								</h4>
								<span className="text-xs text-muted-foreground block">
									{formatDate(note.updatedAt)}
								</span>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										onDeleteNote(note.id);
									}}
									className="absolute top-4 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/90 hover:transition-all"
									title="Deletar nota"
								>
									<Trash2 size={16} />
								</button>
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
