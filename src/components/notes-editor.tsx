import { forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/notes";

interface NotesEditorProps {
	selectedNote: Note | null;
	editContent: string;
	onContentChange: (content: string) => void;
}

export const NotesEditor = forwardRef<HTMLTextAreaElement, NotesEditorProps>(
	({ selectedNote, editContent, onContentChange }, ref) => {
		if (!selectedNote) {
			return (
				<div className="flex-1 bg-background min-h-0 flex flex-col items-center justify-center">
					<p className="text-muted-foreground">
						Selecione uma nota para editar
					</p>
				</div>
			);
		}

		return (
			<div className="flex-1 min-h-0 flex flex-col ">
				<Textarea
					ref={ref}
					value={editContent}
					onChange={(e) => onContentChange(e.target.value)}
					className={cn(
						"min-w-full prose prose-invert prose-zinc flex-1 p-4 rounded-none resize-none border-none text-base leading-relaxed focus-visible:ring-0",
						"font-normal overflow-y-auto scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent bg-background! p-6",
					)}
					placeholder="Comece a escrever..."
				/>
			</div>
		);
	},
);

NotesEditor.displayName = "NotesEditor";
