import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, CalendarX, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
	Dialog,
	DialogContent,
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
import { combineDateAndTime, formatTimeFromDate } from "@/utils/date-helpers";
import { DateSelector } from "./date-selector";
import { MoveToGroupDialog } from "./move-to-group-dialog";

interface TaskDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	task: Task;
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
		type?: "task" | "event";
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
	const [startTime, setStartTime] = useState<string>("");
	const [endTime, setEndTime] = useState<string>("");
	const [showGroupSelector, setShowGroupSelector] = useState(false);
	const [isMoveToGroupDialogOpen, setIsMoveToGroupDialogOpen] = useState(false);
	const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
	const [dateValidationError, setDateValidationError] = useState<string>("");
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
		setValue("title", task.title);
		setValue("description", task.description);
		setValue("priority", task.priority);
		setValue("completed", task.completed);
		if (task.columnId) {
			setValue("columnId", task.columnId);
		}

		// Set date and times from task or initial dates
		if (task.startDate) {
			const startDate = new Date(task.startDate);
			setValue("startDate", startDate);
			setStartTime(formatTimeFromDate(startDate));
		} else if (initialStartDate) {
			setValue("startDate", initialStartDate);
			setStartTime(formatTimeFromDate(initialStartDate));
		}

		if (task.endDate) {
			const endDate = new Date(task.endDate);
			setValue("endDate", endDate);
			setEndTime(formatTimeFromDate(endDate));
		} else if (initialEndDate) {
			setValue("endDate", initialEndDate);
			setEndTime(formatTimeFromDate(initialEndDate));
		}

		setShowGroupSelector(!task.columnId);
	}, [task, setValue, initialStartDate, initialEndDate]);

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
			type: task.type || "task",
			startDate: data.startDate ? data.startDate.toISOString() : null,
			endDate: data.endDate ? data.endDate.toISOString() : null,
		};

		onSave(formattedData);
		onOpenChange(false);
	};

	const handleToggleCalendar = () => {
		const isCurrentlyEvent = task.type === "event";

		if (!isCurrentlyEvent) {
			const startDate = watch("startDate");
			const endDate = watch("endDate");

			if (!startDate || !endDate) {
				toast.error("Defina uma data e hora antes de adicionar ao calendário");
				return;
			}
		}

		const formattedData = {
			title: watch("title"),
			description: watch("description") || "",
			priority: watch("priority"),
			columnId: watch("columnId"),
			completed: watch("completed"),
			allDay: watch("allDay") || false,
			type: isCurrentlyEvent ? ("task" as const) : ("event" as const),
			startDate: isCurrentlyEvent
				? null
				: watch("startDate")?.toISOString() || null,
			endDate: isCurrentlyEvent
				? null
				: watch("endDate")?.toISOString() || null,
		};

		onSave(formattedData);
		onOpenChange(false);
	};

	const handleCancel = () => {
		reset();
		onOpenChange(false);
	};

	const taskIsInCalendar = useMemo(() => {
		return task.type === "event";
	}, [task]);

	const handleDeleteConfirm = async () => {
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
			<DialogContent className="p-0">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
						<DialogTitle>
							<Input
								id="task-title"
								placeholder="Digite o título da tarefa"
								{...register("title")}
								className="p-1 !bg-transparent border-none !text-2xl !font-semibold"
							/>
							{errors.title && (
								<p className="text-sm text-red-500">{errors.title.message}</p>
							)}
						</DialogTitle>
					</DialogHeader>
					<div className="flex items-start flex-col gap-4 w-full px-6">
						<div className="space-y-2 w-full">
							{/* <Label htmlFor="task-description ">Descrição</Label> */}
							<Textarea
								id="task-description"
								placeholder="Descreva os detalhes da tarefa"
								{...register("description")}
								className="resize-none min-h-[200px] max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent"
							/>
							{errors.description && (
								<p className="text-sm text-red-500">
									{errors.description.message}
								</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
							<div className="space-y-2">
								<Label htmlFor="task-priority">Prioridade</Label>
								<Select
									value={watch("priority")}
									onValueChange={(value) =>
										setValue("priority", value as "low" | "medium" | "high")
									}
								>
									<SelectTrigger id="task-priority" className="w-full">
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
									<SelectTrigger id="task-status" className="w-full">
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

							<div className="space-y-2">
								<Label htmlFor="task-date">Data</Label>
								<DateSelector
									selectedDate={watch("startDate")}
									initialDate={watch("startDate")}
									initialStartTime={startTime}
									initialEndTime={endTime}
									onSelectDate={(date, start, end) => {
										if (date) {
											setStartTime(start);
											setEndTime(end);
											setValue("startDate", combineDateAndTime(date, start));
											setValue("endDate", combineDateAndTime(date, end));
											setDateValidationError(""); // Clear error when date is successfully selected
										}
									}}
									onClearDate={() => {
										setValue("startDate", null);
										setValue("endDate", null);
										setDateValidationError("");
									}}
									onValidationError={(error) => {
										setDateValidationError(error);
									}}
								>
									<Button
										variant="outline"
										className="w-full justify-start pr-8"
									>
										{watch("startDate")
											? `${watch("startDate")?.toLocaleDateString("pt-BR", {
													day: "2-digit",
													month: "2-digit",
												})} • ${startTime} - ${endTime}`
											: "Definir Data"}
									</Button>
								</DateSelector>
								{errors.startDate && (
									<p className="text-xs text-red-500">
										{errors.startDate.message}
									</p>
								)}
								{dateValidationError && (
									<p className="text-xs text-red-500">{dateValidationError}</p>
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
										<SelectTrigger id="task-column">
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

					<DialogFooter className="flex items-center justify-between p-6 border-t border-border">
						<div className="flex gap-2 w-full">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setIsDeleteAlertOpen(true)}
								size="icon"
								title="Excluir"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
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
							<Button
								type="button"
								variant="ghost"
								onClick={handleToggleCalendar}
								size="icon"
								title={
									taskIsInCalendar
										? "Remover do Calendário"
										: "Adicionar ao Calendário"
								}
							>
								{taskIsInCalendar ? (
									<CalendarX className="h-4 w-4" />
								) : (
									<CalendarPlus className="h-4 w-4" />
								)}
							</Button>
						</div>
						<div className="flex gap-2">
							<Button type="button" variant="outline" onClick={handleCancel}>
								Cancelar
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="bg-gradient-primary border-0 cursor-pointer"
							>
								{isSubmitting ? "Salvando..." : "Salvar"}
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
