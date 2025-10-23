import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarX, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
import { useTaskGroupsWithDetails } from "@/hooks/use-task-groups-with-details";
import { useTasks } from "@/hooks/use-tasks";
import { taskFormSchema } from "@/schemas/taskSchema";
import type { Task, TaskColumn } from "@/types/tasks";
import { DateSelector } from "./date-selector";
import { MoveToGroupDialog } from "./move-to-group-dialog";

interface TaskDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	task?: Task | null;
	columnId?: string;
	columns?: TaskColumn[];
	type?: "task" | "event";
	initialStartDate?: Date | null;
	initialEndDate?: Date | null;
	onSave: (taskData: {
		title: string;
		description: string;
		priority: "low" | "medium" | "high";
		columnId?: string | null;
		completed: boolean;
		allDay: boolean;
		startDate?: string | null;
		endDate?: string | null;
	}) => void;
}

export const TaskDialog = ({
	isOpen,
	onOpenChange,
	type = "task",
	task,
	columnId,
	columns,
	initialStartDate,
	initialEndDate,
	onSave,
}: TaskDialogProps) => {
	const isEditMode = !!task;
	const [hasDate, setHasDate] = useState(false);
	const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
	const [showGroupSelector, setShowGroupSelector] = useState(false);
	const [isMoveToGroupDialogOpen, setIsMoveToGroupDialogOpen] = useState(false);
	const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
	const { taskGroupsWithDetails } = useTaskGroupsWithDetails();
	const { deleteTask } = useTasks();

	const taskHasNoGroup = useMemo(() => {
		return task && !task.columnId;
	}, [task]);

	const visibleGroups = useMemo(() => {
		return taskGroupsWithDetails;
	}, [taskGroupsWithDetails]);

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
				type === "event"
					? undefined
					: columnId || (columns && columns.length > 0 ? columns[0].id : ""),
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
			if (task.columnId) {
				setValue("columnId", task.columnId);
			}

			const hasDates = !!(task.startDate || task.endDate);
			setHasDate(hasDates);

			if (task.startDate) {
				setValue("startDate", new Date(task.startDate));
			}
			if (task.endDate) {
				setValue("endDate", new Date(task.endDate));
				setSelectedEndDate(new Date(task.endDate));
			}

			setShowGroupSelector(!task.columnId);
		} else {
			const defaultColumnId =
				type === "event"
					? undefined
					: columnId || (columns && columns.length > 0 ? columns[0].id : "");

			const hasInitialDates = !!(initialStartDate || initialEndDate);
			setHasDate(hasInitialDates);

			reset({
				title: "",
				description: "",
				priority: "low",
				columnId: defaultColumnId,
				completed: false,
				allDay: false,
			});

			if (initialStartDate) {
				setValue("startDate", initialStartDate);
			}
			if (initialEndDate) {
				setValue("endDate", initialEndDate);
				setSelectedEndDate(initialEndDate);
			} else {
				setSelectedEndDate(null);
			}

			setShowGroupSelector(false);
		}
	}, [
		task,
		columnId,
		columns,
		initialStartDate,
		initialEndDate,
		setValue,
		reset,
		type,
	]);

	const onSubmit = (data: {
		title: string;
		description: string;
		priority: "low" | "medium" | "high";
		columnId?: string | null;
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

	const handleRemoveFromCalendar = () => {
		if (!task) return;

		const formattedData = {
			title: watch("title"),
			description: watch("description") || "",
			priority: watch("priority"),
			columnId: watch("columnId"),
			completed: watch("completed"),
			allDay: watch("allDay") || false,
			startDate: null,
			endDate: null,
		};

		onSave(formattedData);
		onOpenChange(false);
	};

	const handleCancel = () => {
		reset();
		onOpenChange(false);
	};

	const taskIsScheduled = useMemo(() => {
		return task && (task.startDate || task.endDate);
	}, [task]);

	const handleDeleteConfirm = async () => {
		if (!task) return;

		try {
			await deleteTask(task.id);
			toast.success("Tarefa excluída com sucesso!");
			onOpenChange(false);
		} catch (error) {
			console.error("Erro ao excluir tarefa:", error);
		}
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
											setSelectedEndDate(range.to ?? null);
										} else {
											setValue("startDate", null);
											setValue("endDate", null);
											setSelectedEndDate(null);
										}
									}}
									initialRange={
										task?.startDate && task?.endDate
											? {
													from: new Date(task.startDate),
													to: new Date(task.endDate),
												}
											: initialStartDate && initialEndDate
												? {
														from: initialStartDate,
														to: initialEndDate,
													}
												: undefined
									}
									selectedEndDate={selectedEndDate}
								>
									<Button variant="outline" className="">
										{hasDate && selectedEndDate
											? selectedEndDate.toLocaleDateString("pt-BR", {
													day: "2-digit",
													month: "2-digit",
													year: "2-digit",
												})
											: "Definir Data"}
									</Button>
								</DateSelector>
								{errors.startDate && (
									<p className="text-sm text-red-500">
										{errors.startDate.message}
									</p>
								)}
							</div>

							{/* Seletor de coluna para tasks normais */}
							{columns && columns.length > 0 && type !== "event" && (
								<div className="space-y-2 ">
									<Label htmlFor="task-column">Coluna</Label>
									<Select
										value={watch("columnId") || undefined}
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
					</div>

					<DialogFooter className="flex items-center justify-between">
						<div className="flex gap-2">
							{isEditMode && (
								<Button
									type="button"
									variant="destructive"
									onClick={() => setIsDeleteAlertOpen(true)}
									className="gap-2"
								>
									<Trash2 className="h-4 w-4" />
									Excluir
								</Button>
							)}
							{taskHasNoGroup &&
								showGroupSelector &&
								visibleGroups.length > 0 && (
									<Button
										type="button"
										variant="outline"
										onClick={() => setIsMoveToGroupDialogOpen(true)}
									>
										Mover para Grupo
									</Button>
								)}
							{taskIsScheduled && (
								<Button
									type="button"
									variant="outline"
									onClick={handleRemoveFromCalendar}
									className="gap-2"
								>
									<CalendarX className="h-4 w-4" />
									Remover do Calendário
								</Button>
							)}
						</div>
						<div className="flex gap-2">
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
						</div>
					</DialogFooter>
				</form>
			</DialogContent>

			<MoveToGroupDialog
				isOpen={isMoveToGroupDialogOpen}
				onOpenChange={setIsMoveToGroupDialogOpen}
				groups={visibleGroups}
				onMove={(_groupId, columnId) => {
					setValue("columnId", columnId);
					setShowGroupSelector(false);
					setIsMoveToGroupDialogOpen(false);
				}}
			/>

			<ConfirmDialog
				open={isDeleteAlertOpen}
				onOpenChange={setIsDeleteAlertOpen}
				title="Excluir tarefa?"
				description="Esta ação não pode ser desfeita. A tarefa será excluída permanentemente."
				confirmLabel="Excluir"
				cancelLabel="Cancelar"
				onConfirm={handleDeleteConfirm}
				variant="destructive"
			/>
		</Dialog>
	);
};
