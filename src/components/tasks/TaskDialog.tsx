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
import {
	type CreateTaskFormData,
	createTaskSchema,
} from "@/schemas/taskSchema";
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
	} = useForm<CreateTaskFormData>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			title: "",
			description: "",
			priority: "medium",
			columnId: columnId,
		},
	});

	useEffect(() => {
		if (task) {
			setValue("title", task.title);
			setValue("description", task.description);
			setValue("priority", task.priority);
		} else {
			reset({
				title: "",
				description: "",
				priority: "medium",
				columnId: columnId,
			});
		}
	}, [task, columnId, setValue, reset]);

	const onSubmit = (data: CreateTaskFormData) => {
		onSave({
			title: data.title,
			description: data.description,
			priority: data.priority,
			columnId: data.columnId || columnId,
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

					<div className="space-y-2">
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
							<p className="text-sm text-red-500">{errors.priority.message}</p>
						)}
					</div>

					{!isEditMode && columns && columns.length > 0 && (
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
									<SelectValue placeholder="Selecione uma coluna" />
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
