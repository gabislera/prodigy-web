import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface AINotesDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onCreateNote: (instruction: string) => void;
}

export function AINotesDialog({
	isOpen,
	onOpenChange,
	onCreateNote,
}: AINotesDialogProps) {
	const [instruction, setInstruction] = useState("");

	const handleSubmit = () => {
		if (instruction.trim()) {
			onCreateNote(instruction);
			onOpenChange(false);
			setInstruction("");
		}
	};

	const handleCancel = () => {
		onOpenChange(false);
		setInstruction("");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Sparkles className="w-5 h-5 text-purple-400" />
						Gerar nota com IA
					</DialogTitle>
					<DialogDescription>
						Descreva o que você gostaria que a IA criasse para você.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<Textarea
						value={instruction}
						onChange={(e) => setInstruction(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Ex: Escreva um resumo sobre inteligência artificial..."
						className="min-h-[100px] resize-none"
					/>
				</div>
				<DialogFooter className="gap-2">
					<Button type="button" variant="outline" onClick={handleCancel}>
						Cancelar
					</Button>
					<Button
						type="button"
						onClick={handleSubmit}
						disabled={!instruction.trim()}
						className="bg-purple-500 hover:bg-purple-600"
					>
						<Sparkles className="w-4 h-4 mr-2" />
						Enviar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
