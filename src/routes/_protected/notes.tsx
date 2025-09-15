import { createFileRoute } from "@tanstack/react-router";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface Note {
	id: string;
	title: string;
	text?: string;
}

export const Route = createFileRoute("/_protected/notes")({
	component: NotesPage,
});

function NotesPage() {
	const [notes, setNotes] = useState<Note[]>([
		{
			title: "Exemplo",
			id: "1",
			text: "Esse é um exemplo de nota",
		},
	]);

	const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

	const activeNote = notes.find((n) => n.id === activeNoteId);

	const handleAddNote = () => {
		const newId = Math.random().toString(36).substring(2, 8);
		const newNote = { title: "Nova Nota", id: newId, text: "Nova nota" };
		setNotes((current) => [...current, newNote]);
		setActiveNoteId(newNote.id);
	};

	const handleDeleteNote = (id: string) => {
		const filteredNotes = notes.filter((item) => item.id !== id);
		setNotes(filteredNotes);
	};

	const handleEditNote = (value: string) => {
		if (!activeNoteId) return;
		setNotes((current) =>
			current.map((note) =>
				note.id === activeNoteId ? { ...note, text: value } : note,
			),
		);
	};

	return (
		<div className="w-full h-full">
			<div className="border border-zinc-900 h-14 flex flex-col items-end justify-center">
				<button
					onClick={handleAddNote}
					type="button"
					className="border-none bg-zinc-700 rounded-xl w-fit px-4 py-1"
				>
					Nova Nota
				</button>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
				<div className="flex flex-col items-center lg:col-span-1 gap-2 border-r border">
					{notes.map((item) => {
						return (
							<div
								key={item.id}
								className="w-full flex border border-zinc-900 data-active[]"
								data-active={item.id === activeNote?.id}
							>
								<button
									type="button"
									onClick={() => setActiveNoteId(item.id)}
									className="flex-1 p-2 text-left hover:bg-zinc-800 transition-colors"
									aria-label={`Selecionar nota: ${item.title}`}
								>
									{item.title}
								</button>
								<button
									type="button"
									onClick={() => handleDeleteNote(item.id)}
									className="p-2 hover:bg-red-100 border-l border-zinc-900 transition-colors"
									aria-label={`Deletar nota: ${item.title}`}
								>
									<Trash size={16} />
								</button>
							</div>
						);
					})}
				</div>

				<div className="border border-zinc-900 h-full lg:col-span-2">
					<textarea
						onChange={(e) => handleEditNote(e.target.value)}
						className="w-full min-h-full resize-none"
						value={activeNote?.text || ""}
					></textarea>
				</div>
			</div>
		</div>
	);
}
