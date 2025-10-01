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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTasks } from "@/hooks/use-tasks";
import {
	type CreateGroupFormData,
	createGroupSchema,
} from "@/schemas/taskSchema";
import type { TaskGroup } from "@/types/tasks";
import { colorOptions, iconOptions } from "@/utils/taskUtils";

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
	const { createTaskGroup, updateTaskGroup } = useTasks();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
		setValue,
		reset,
	} = useForm<CreateGroupFormData>({
		resolver: zodResolver(createGroupSchema),
		defaultValues: {
			name: editingGroup?.name || "",
			icon: editingGroup?.icon || "briefcase",
			color: editingGroup?.color || "text-blue-500",
		},
	});

	const watchedValues = watch();

	// Reset form when editingGroup changes
	useEffect(() => {
		if (editingGroup) {
			reset({
				name: editingGroup.name,
				icon: editingGroup.icon,
				color: editingGroup.color,
			});
		} else {
			reset({
				name: "",
				icon: "briefcase",
				color: "text-blue-500",
			});
		}
	}, [editingGroup, reset]);

	const onSubmit = async (data: CreateGroupFormData) => {
		try {
			// Get the background color for the selected color
			const selectedColorOption = colorOptions.find(
				(option) => option.value === data.color,
			);

			if (editingGroup) {
				// Update existing group
				await updateTaskGroup({
					groupId: editingGroup.id,
					data: {
						name: data.name,
						icon: data.icon,
						color: data.color,
						bgColor: selectedColorOption?.bgColor || "bg-blue-500/10",
					},
				});
			} else {
				// Create new group
				await createTaskGroup({
					id: "",
					name: data.name,
					icon: data.icon,
					color: data.color,
					bgColor: selectedColorOption?.bgColor || "bg-blue-500/10",
				});
			}

			reset();
			onOpenChange(false);
		} catch (error) {
			console.error("Erro ao salvar grupo:", error);
		}
	};

	const selectedIconOption = iconOptions.find(
		(option) => option.value === watchedValues.icon,
	);
	const selectedColorOption = colorOptions.find(
		(option) => option.value === watchedValues.color,
	);

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

					<div className="flex items-center gap-4">
						<div className="space-y-2">
							<Select
								value={watchedValues.icon}
								onValueChange={(value) => setValue("icon", value)}
							>
								<SelectTrigger>
									<SelectValue>
										<div className="flex items-center gap-2">
											{selectedIconOption && (
												<selectedIconOption.icon
													className={`h-4 w-4 ${selectedIconOption.color}`}
												/>
											)}
										</div>
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{iconOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<div className="flex items-center gap-2">
												<option.icon className={`h-4 w-4 ${option.color}`} />
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.icon && (
								<p className="text-sm text-red-500">{errors.icon.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Select
								value={watchedValues.color}
								onValueChange={(value) => setValue("color", value)}
							>
								<SelectTrigger>
									<SelectValue>
										<div className="flex items-center gap-2">
											{selectedColorOption && (
												<>
													<div
														className={`w-4 h-4 rounded-full ${selectedColorOption.bgColor} border`}
													/>
													<span>{selectedColorOption.label}</span>
												</>
											)}
										</div>
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{colorOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<div className="flex items-center gap-2">
												<div
													className={`w-4 h-4 rounded-full ${option.bgColor} border`}
												/>
												<span>{option.label}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.color && (
								<p className="text-sm text-red-500">{errors.color.message}</p>
							)}
						</div>
					</div>

					<div
						className={`p-3 border rounded-lg ${selectedColorOption?.bgColor} `}
					>
						<div className="flex items-center gap-2 mb-2">
							{selectedIconOption && (
								<selectedIconOption.icon
									className={`h-4 w-4 ${watchedValues.color}`}
								/>
							)}
							<span className="text-sm font-medium">
								{watchedValues.name || "Nome do Grupo"}
							</span>
						</div>
						<p className="text-xs text-muted-foreground">Preview do grupo</p>
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
