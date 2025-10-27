import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTaskGroups } from "@/hooks/use-task-groups";
import {
	type CreateGroupFormData,
	createGroupSchema,
} from "@/schemas/taskSchema";
import type { TaskGroup } from "@/types/tasks";

interface CreateGroupDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	editingGroup?: TaskGroup | null;
	// onCreateGroup: (group: { name: string; icon: string; color: string }) => void;
}

export const CreateGroupDialog = ({
	isOpen,
	onOpenChange,
	editingGroup,
	// onCreateGroup,
}: CreateGroupDialogProps) => {
	const { createTaskGroup, updateTaskGroup } = useTaskGroups();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<CreateGroupFormData>({
		resolver: zodResolver(createGroupSchema),
		defaultValues: {
			name: editingGroup?.name || "",
			description: editingGroup?.description || "",
		},
	});

	// Reset form when editingGroup changes
	useEffect(() => {
		if (editingGroup) {
			reset({
				name: editingGroup.name,
				description: editingGroup.description || "",
			});
		} else {
			reset({
				name: "",
				description: "",
			});
		}
	}, [editingGroup, reset]);

	const onSubmit = async (data: CreateGroupFormData) => {
		try {
			if (editingGroup) {
				// Update existing group
				await updateTaskGroup({
					groupId: editingGroup.id,
					data: {
						name: data.name,
						description: data.description,
					},
				});
			} else {
				// Create new group
				await createTaskGroup({
					id: "",
					name: data.name,
					description: data.description,
				});
			}

			reset();
			onOpenChange(false);
		} catch (error) {
			console.error("Erro ao salvar grupo:", error);
			toast.error("Erro ao salvar grupo. Tente novamente.");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{editingGroup ? "Editar Grupo de Tarefas" : "Novo Grupo de Tarefas"}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Input
							{...register("name")}
							id="group-name"
							placeholder="Ex: Projetos Pessoais"
						/>
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Textarea
							{...register("description")}
							id="group-description"
							placeholder="Descrição do grupo (opcional)"
							rows={3}
						/>
						{errors.description && (
							<p className="text-sm text-red-500">{errors.description.message}</p>
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
								? editingGroup
									? "Salvando..."
									: "Criando..."
								: editingGroup
									? "Salvar Alterações"
									: "Criar Grupo"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
