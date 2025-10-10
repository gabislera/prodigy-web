import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { taskFormSchema } from "@/schemas/taskSchema";
import type { Task, TaskColumn } from "@/types/tasks";
import { DateSelector } from "./DateSelector";

interface TaskDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	task?: Task | null;
	columnId?: string;
	columns?: TaskColumn[];
	onSave: (taskData: {
		title: string;
		description: string;
		priority: "low" | "medium" | "high";
		columnId: string;
		completed: boolean;
		allDay: boolean;
		startDate?: string | null;
		endDate?: string | null;
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
	const [hasDate, setHasDate] = useState(false);

	// console.log(columns);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		setValue,
		watch,
	} = useForm({
		resolver: zodResolver(taskFormSchema),
		defaultValues: {
			title: "",
			description: "",
			priority: "low" as const,
			columnId:
				columnId || (columns && columns.length > 0 ? columns[0].id : ""),
			completed: false,
			allDay: false,
		},
	});

	useEffect(() => {
		if (task) {
			setValue("title", task.title);
			setValue("description", task.description);
			setValue("priority", task.priority);
			setValue("completed", task.completed);
			setValue("columnId", task.columnId);

			const hasDates = !!(task.startDate || task.endDate);
			setHasDate(hasDates);

			if (task.startDate) {
				setValue("startDate", new Date(task.startDate));
			}
			if (task.endDate) {
				setValue("endDate", new Date(task.endDate));
			}
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
				allDay: false,
			});
			// setHasDate(false);
		}
	}, [task, columnId, columns, setValue, reset]);

	const onSubmit = (data: {
		title: string;
		description: string;
		priority: "low" | "medium" | "high";
		columnId: string;
		completed: boolean;
		allDay: boolean;
		startDate?: Date | null;
		endDate?: Date | null;
	}) => {
		const formattedData = {
			...data,
			startDate: data.startDate ? data.startDate.toISOString() : null,
			endDate: data.endDate ? data.endDate.toISOString() : null,
		};

		onSave(formattedData);
		onOpenChange(false);
	};

	const handleCancel = () => {
		reset();
		onOpenChange(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleCancel}>
			<DialogContent>
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
					<div className="flex items-start flex-col gap-4 w-full">
						<div className="space-y-2 w-full">
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

						<div className="space-y-2 w-full">
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

							<div className="space-y-2 mb-2">
								<Label htmlFor="task-date">Data</Label>
								<DateSelector
									hasDate={hasDate}
									onDateToggle={setHasDate}
									onSelectRange={(range) => {
										if (hasDate && range) {
											setValue("startDate", range.from ?? null);
											setValue("endDate", range.to ?? null);
										} else {
											setValue("startDate", null);
											setValue("endDate", null);
										}
									}}
									initialRange={
										task?.startDate && task?.endDate
											? {
													from: new Date(task.startDate),
													to: new Date(task.endDate),
												}
											: undefined
									}
								>
									<Button variant="outline" className="">
										{hasDate ? "Editar Data" : "Definir Data"}
									</Button>
								</DateSelector>
								{errors.startDate && (
									<p className="text-sm text-red-500">
										{errors.startDate.message}
									</p>
								)}
							</div>

							{columns && columns.length > 0 && (
								<div className="space-y-2 ">
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
						{hasDate && watch("startDate") && watch("endDate") && (
							<div className="text-sm text-muted-foreground">
								<span>
									{(() => {
										const startDate = new Date(watch("startDate") as Date);
										const endDate = new Date(watch("endDate") as Date);

										if (startDate.getTime() === endDate.getTime()) {
											return startDate.toLocaleDateString("pt-BR");
										} else {
											return `${startDate.toLocaleDateString("pt-BR")} → ${endDate.toLocaleDateString("pt-BR")}`;
										}
									})()}
								</span>
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
							className={
								isEditMode
									? "bg-gradient-primary border-0 cursor-pointer"
									: "cursor-pointer"
							}
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
