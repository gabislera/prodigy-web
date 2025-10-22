import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	type CreateColumnFormData,
	createColumnSchema,
} from "@/schemas/taskSchema";
import type { TaskColumn } from "@/types/tasks";

interface ColumnDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	editingColumn?: TaskColumn | null;
	onSave: (title: string, columnId?: string) => Promise<void>;
}

export const ColumnDialog = ({
	isOpen,
	onOpenChange,
	editingColumn,
	onSave,
}: ColumnDialogProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<CreateColumnFormData>({
		resolver: zodResolver(createColumnSchema),
		defaultValues: {
			title: editingColumn?.title || "",
		},
	});

	useEffect(() => {
		if (isOpen) {
			if (editingColumn) {
				reset({
					title: editingColumn.title,
				});
			} else {
				reset({
					title: "",
				});
			}
		}
	}, [isOpen, editingColumn, reset]);

	const onSubmit = async (data: CreateColumnFormData) => {
		await onSave(data.title, editingColumn?.id);
		reset();
		onOpenChange(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{editingColumn ? "Editar Coluna" : "Nova Coluna"}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Input
							{...register("title")}
							id="column-title"
							placeholder="Ex: A Fazer, Em Progresso, Concluído"
						/>
						{errors.title && (
							<p className="text-sm text-red-500">{errors.title.message}</p>
						)}
					</div>

					<div className="flex gap-2 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="flex-1"
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="flex-1 bg-gradient-primary border-0"
						>
							{isSubmitting
								? editingColumn
									? "Salvando..."
									: "Criando..."
								: editingColumn
									? "Salvar Alterações"
									: "Criar Coluna"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
