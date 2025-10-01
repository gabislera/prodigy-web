import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type TaskFormData, taskFormSchema } from "@/schemas/taskSchema";
import type { Task, TaskColumn } from "@/types/tasks";

interface TaskDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	task?: Task | null;
	columnId?: string;
	columns?: TaskColumn[];
	onSave: (taskData: {
		title: string;
		description: string;
		priority: string;
		columnId?: string;
		completed: boolean;
	}) => void;
}

export const TaskDialog = ({
	isOpen,
	onOpenChange,
	task,
	columnId,
	columns,
	onSave,
}: TaskDialogProps) => {
	const isEditMode = !!task;

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		setValue,
		watch,
	} = useForm<TaskFormData>({
		resolver: zodResolver(taskFormSchema),
		defaultValues: {
			title: "",
			description: "",
			priority: "low",
			columnId:
				columnId || (columns && columns.length > 0 ? columns[0].id : ""),
			completed: false,
		},
	});

	useEffect(() => {
		if (task) {
			setValue("title", task.title);
			setValue("description", task.description);
			setValue("priority", task.priority);
			setValue("completed", task.completed);
		} else {
			// Se não há columnId passado, usar a primeira coluna disponível
			const defaultColumnId =
				columnId || (columns && columns.length > 0 ? columns[0].id : "");

			reset({
				title: "",
				description: "",
				priority: "low",
				columnId: defaultColumnId,
				completed: false,
			});
		}
	}, [task, columnId, columns, setValue, reset]);

	const onSubmit = (data: TaskFormData) => {
		onSave({
			title: data.title,
			description: data.description,
			priority: data.priority,
			columnId: data.columnId || columnId,
			completed: data.completed,
		});
		onOpenChange(false);
	};

	const handleCancel = () => {
		reset();
		onOpenChange(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleCancel}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{isEditMode ? "Editar Tarefa" : "Nova Tarefa"}
					</DialogTitle>
					{!isEditMode && (
						<DialogDescription>
							Adicione uma nova tarefa à sua lista.
						</DialogDescription>
					)}
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="task-title">Título</Label>
						<Input
							id="task-title"
							placeholder="Digite o título da tarefa"
							{...register("title")}
							className="font-medium focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
						/>
						{errors.title && (
							<p className="text-sm text-red-500">{errors.title.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="task-description">Descrição</Label>
						<Textarea
							id="task-description"
							placeholder="Descreva os detalhes da tarefa"
							{...register("description")}
							rows={isEditMode ? 6 : 4}
							className="resize-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
						/>
						{errors.description && (
							<p className="text-sm text-red-500">
								{errors.description.message}
							</p>
						)}
					</div>

					<div className="flex items-center gap-4">
						<div className="space-y-2 ">
							<Label htmlFor="task-priority">Prioridade</Label>
							<Select
								value={watch("priority")}
								onValueChange={(value) =>
									setValue("priority", value as "low" | "medium" | "high")
								}
							>
								<SelectTrigger
									id="task-priority"
									className="focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="low">Baixa</SelectItem>
									<SelectItem value="medium">Média</SelectItem>
									<SelectItem value="high">Alta</SelectItem>
								</SelectContent>
							</Select>
							{errors.priority && (
								<p className="text-sm text-red-500">
									{errors.priority.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="task-status">Status</Label>
							<Select
								value={watch("completed") ? "completed" : "incomplete"}
								onValueChange={(value) =>
									setValue("completed", value === "completed")
								}
							>
								<SelectTrigger
									id="task-status"
									className="focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="incomplete">Incompleta</SelectItem>
									<SelectItem value="completed">Completa</SelectItem>
								</SelectContent>
							</Select>
							{errors.completed && (
								<p className="text-sm text-red-500">
									{errors.completed.message}
								</p>
							)}
						</div>

						{columns && columns.length > 0 && (
							<div className="space-y-2">
								<Label htmlFor="task-column">Coluna</Label>
								<Select
									value={watch("columnId")}
									onValueChange={(value) => setValue("columnId", value)}
								>
									<SelectTrigger
										id="task-column"
										className="focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{columns.map((column) => (
											<SelectItem key={column.id} value={column.id}>
												{column.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.columnId && (
									<p className="text-sm text-red-500">
										{errors.columnId.message}
									</p>
								)}
							</div>
						)}
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={handleCancel}>
							Cancelar
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className={isEditMode ? "bg-gradient-primary border-0" : ""}
						>
							{isSubmitting
								? isEditMode
									? "Salvando..."
									: "Criando..."
								: isEditMode
									? "Salvar"
									: "Criar Tarefa"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
