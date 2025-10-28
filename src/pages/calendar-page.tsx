import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
	type CalendarEvent,
	EventCalendar,
	TasksBottomSheet,
	TasksSidebar,
} from "@/components/calendar";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTaskGroupsWithDetails } from "@/hooks/use-task-groups-with-details";
import { useTasks } from "@/hooks/use-tasks";
import type { Task, TaskColumn } from "@/types/tasks";
import { formatTimeSimple, getDefaultEventTimes } from "@/utils/date-helpers";

// Helper functions to convert between Task and CalendarEvent
const taskToCalendarEvent = (task: Task): CalendarEvent => {
	if (!task || !task.startDate || !task.endDate) {
		throw new Error("Task is null or undefined, or missing dates");
	}

	return task as CalendarEvent;
};

export function CalendarPage() {
	const { taskGroupsWithDetails } = useTaskGroupsWithDetails();
	const { updateTask, createTask, tasks } = useTasks();
	const isMobile = useIsMobile();

	const getInitialCalendarSidebar = () => {
		if (typeof window === "undefined") return false;
		const stored = localStorage.getItem("calendar_sidebar_state");
		return stored ? JSON.parse(stored) : false;
	};

	const [isTaskSidebarOpen, setIsTaskSidebarOpen] = useState<boolean>(
		getInitialCalendarSidebar,
	);

	const [isTaskBottomSheetOpen, setIsTaskBottomSheetOpen] =
		useState<boolean>(false);

	// Filter states
	const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
	const [completionFilter, setCompletionFilter] = useState<
		"all" | "completed" | "incomplete"
	>("all");

	const toggleCalendarSidebar = () => {
		// Mobile: abre bottom sheet
		if (isMobile) {
			setIsTaskBottomSheetOpen((prev) => !prev);
		} else {
			// Desktop: abre sidebar
			setIsTaskSidebarOpen((prev) => {
				const next = !prev;
				localStorage.setItem("calendar_sidebar_state", JSON.stringify(next));
				return next;
			});
		}
	};

	const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [initialStartDate, setInitialStartDate] = useState<Date | null>(null);
	const [initialEndDate, setInitialEndDate] = useState<Date | null>(null);

	const [isDragConfirmDialogOpen, setIsDragConfirmDialogOpen] = useState(false);
	const [dragTaskId, setDragTaskId] = useState<string | null>(null);
	const [dragStartDate, setDragStartDate] = useState<Date | null>(null);
	const [dragEndDate, setDragEndDate] = useState<Date | null>(null);

	// Combina tasks de grupos + tasks sem grupo (evita duplicatas)
	const allTasks = useMemo(() => {
		const tasksFromGroups =
			taskGroupsWithDetails?.flatMap((group) =>
				group.columns.flatMap((column) =>
					column.tasks
						.filter((task) => task != null)
						.map((task) => ({
							...task,
							groupId: group.id,
							groupName: group.name,
						})),
				),
			) || [];

		const tasksWithoutGroup = tasks
			.filter((task: Task) => task != null && !task.columnId)
			.map((task: Task) => ({
				...task,
				groupId: null,
				groupName: "Sem grupo",
			}));

		const taskIds = new Set(
			tasksFromGroups.map(
				(task: Task & { groupId: string; groupName: string }) => task.id,
			),
		);
		const uniqueTasksWithoutGroup = tasksWithoutGroup.filter(
			(task: Task & { groupId: null; groupName: string }) =>
				!taskIds.has(task.id),
		);

		return [...tasksFromGroups, ...uniqueTasksWithoutGroup];
	}, [taskGroupsWithDetails, tasks]);

	const calendarTasks = useMemo(
		() => allTasks.filter((task) => task.type === "event"),
		[allTasks],
	);

	const unscheduledTasks = useMemo(
		() => allTasks.filter((task) => task.type !== "event"),
		[allTasks],
	);

	const allColumns = useMemo<TaskColumn[]>(
		() => taskGroupsWithDetails?.flatMap((group) => group.columns) || [],
		[taskGroupsWithDetails],
	);

	// Convert tasks to calendar events
	const calendarEvents = useMemo(
		() =>
			calendarTasks
				.filter((task) => task?.startDate && task?.endDate)
				.map(taskToCalendarEvent),
		[calendarTasks],
	);

	const handleEventUpdate = async (event: CalendarEvent) => {
		const task = allTasks.find((t) => t.id === event.id);
		if (!task) return;

		try {
			await updateTask({
				taskId: event.id,
				data: {
					startDate: event.startDate,
					endDate: event.endDate,
					allDay: event.allDay,
					type: "event",
				},
			});
			toast.success("Tarefa movida com sucesso!");
		} catch (error) {
			console.error("Erro ao mover tarefa:", error);
			toast.error("Erro ao mover tarefa");
		}
	};

	const handleEventSelect = (event: CalendarEvent) => {
		const task = allTasks.find((t) => t.id === event.id);
		if (task) {
			setSelectedTask(task);
			setInitialStartDate(null);
			setInitialEndDate(null);
			setIsTaskDialogOpen(true);
		}
	};

	const handleEventCreate = (startTime: Date) => {
		// Snap to 15-minute intervals
		const minutes = startTime.getMinutes();
		const remainder = minutes % 15;
		if (remainder !== 0) {
			if (remainder < 7.5) {
				// Round down to nearest 15 min
				startTime.setMinutes(minutes - remainder);
			} else {
				// Round up to nearest 15 min
				startTime.setMinutes(minutes + (15 - remainder));
			}
			startTime.setSeconds(0);
			startTime.setMilliseconds(0);
		}

		// Create end time (1 hour later)
		const endTime = new Date(startTime);
		endTime.setHours(startTime.getHours() + 1);

		const newTask: Task = {
			id: "",
			title: "",
			description: "",
			priority: "medium",
			columnId: null,
			position: 0,
			completed: false,
			type: "event",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		setSelectedTask(newTask);
		setInitialStartDate(startTime);
		setInitialEndDate(endTime);
		setIsTaskDialogOpen(true);
	};

	const handleTaskClick = (task: { id: string }) => {
		const fullTask = allTasks.find((t) => t.id === task.id);
		if (fullTask) {
			setSelectedTask(fullTask as Task);
			// Set default date/time for calendar events
			const { start, end } = getDefaultEventTimes();
			setInitialStartDate(start);
			setInitialEndDate(end);
			setIsTaskDialogOpen(true);
		}
	};

	const handleExternalDrop = async (date: Date, time?: number) => {
		const taskId = sessionStorage.getItem("draggingTaskId");
		if (!taskId) {
			console.warn("⚠️ Nenhuma task sendo arrastada");
			return;
		}

		const now = new Date();
		const startDate = new Date(date);

		if (time !== undefined) {
			// For week/day views with specific time
			const hours = Math.floor(time);
			const minutes = Math.round((time - hours) * 60);
			startDate.setHours(hours, minutes, 0, 0);
		} else {
			// For month view, use current time
			startDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
		}

		// Default 1 hour duration
		const endDate = new Date(startDate);
		endDate.setHours(startDate.getHours() + 1);

		// Store drag data and show confirmation dialog
		setDragTaskId(taskId);
		setDragStartDate(startDate);
		setDragEndDate(endDate);
		setIsDragConfirmDialogOpen(true);
		sessionStorage.removeItem("draggingTaskId");
	};

	const handleDragConfirm = async () => {
		if (!dragTaskId || !dragStartDate || !dragEndDate) return;

		try {
			await updateTask({
				taskId: dragTaskId,
				data: {
					type: "event",
					startDate: dragStartDate.toISOString(),
					endDate: dragEndDate.toISOString(),
				},
			});
			toast.success("Tarefa adicionada ao calendário!");
		} catch (error) {
			console.error("Erro ao adicionar tarefa ao calendário:", error);
			toast.error("Erro ao adicionar tarefa");
		} finally {
			setIsDragConfirmDialogOpen(false);
			setDragTaskId(null);
			setDragStartDate(null);
			setDragEndDate(null);
		}
	};

	const handleTaskSave = async (taskData: {
		title: string;
		description: string;
		priority: "low" | "medium" | "high";
		columnId?: string | null;
		completed: boolean;
		allDay: boolean;
		type?: "task" | "event";
		startDate?: string | null;
		endDate?: string | null;
	}) => {
		try {
			if (selectedTask?.id) {
				await updateTask({
					taskId: selectedTask.id,
					data: taskData,
				});
				toast.success("Tarefa atualizada com sucesso!");
			} else {
				await createTask({
					...taskData,
					type: "event",
					position: 0,
				});
				toast.success("Tarefa criada com sucesso!");
			}

			setIsTaskDialogOpen(false);
			setSelectedTask(null);
			setInitialStartDate(null);
			setInitialEndDate(null);
		} catch (error) {
			console.error("Erro ao salvar tarefa:", error);
		}
	};

	return (
		<div
			className={`flex h-[calc(100vh-80px)] pb-20 p-4 md:pb-0 md:p-4 gap-0 ${isTaskSidebarOpen ? "gap-4" : ""}`}
		>
			<div className="flex flex-col flex-1 min-h-0 rounded-lg">
				<EventCalendar
					events={calendarEvents}
					onEventSelect={handleEventSelect}
					onEventCreate={handleEventCreate}
					onEventUpdate={handleEventUpdate}
					onExternalDrop={handleExternalDrop}
					onSidebarToggle={toggleCalendarSidebar}
					isSidebarOpen={isTaskSidebarOpen}
				/>
			</div>

			{/* Desktop Sidebar */}
			<div
				className={`hidden md:block transition-all duration-300 ease-in-out overflow-hidden h-full  ${
					isTaskSidebarOpen ? "w-80 opacity-100" : "w-0 opacity-0"
				}`}
			>
				<TasksSidebar
					allTasks={unscheduledTasks}
					taskGroupsWithDetails={taskGroupsWithDetails}
					selectedGroupIds={selectedGroupIds}
					setSelectedGroupIds={setSelectedGroupIds}
					completionFilter={completionFilter}
					setCompletionFilter={setCompletionFilter}
					onTaskClick={handleTaskClick}
				/>
			</div>

			{/* Mobile Bottom Sheet */}
			<TasksBottomSheet
				isOpen={isTaskBottomSheetOpen}
				onOpenChange={setIsTaskBottomSheetOpen}
				allTasks={unscheduledTasks}
				taskGroupsWithDetails={taskGroupsWithDetails}
				selectedGroupIds={selectedGroupIds}
				setSelectedGroupIds={setSelectedGroupIds}
				completionFilter={completionFilter}
				setCompletionFilter={setCompletionFilter}
				onTaskClick={handleTaskClick}
			/>

			{selectedTask && (
				<TaskDialog
					isOpen={isTaskDialogOpen}
					onOpenChange={setIsTaskDialogOpen}
					task={selectedTask}
					columns={allColumns}
					initialStartDate={initialStartDate}
					initialEndDate={initialEndDate}
					onSave={handleTaskSave}
					type="event"
				/>
			)}

			<ConfirmDialog
				open={isDragConfirmDialogOpen}
				onOpenChange={setIsDragConfirmDialogOpen}
				title="Adicionar tarefa ao calendário?"
				description={
					<div className="space-y-2">
						<p>Tem certeza que deseja adicionar esta tarefa ao calendário?</p>
						{dragStartDate && dragEndDate && (
							<div className="text-sm text-muted-foreground">
								<p>
									<strong>Data:</strong>{" "}
									{dragStartDate.toLocaleDateString("pt-BR", {
										day: "2-digit",
										month: "2-digit",
										year: "numeric",
									})}
								</p>
								<p>
									<strong>Horário:</strong> {formatTimeSimple(dragStartDate)} -{" "}
									{formatTimeSimple(dragEndDate)}
								</p>
							</div>
						)}
					</div>
				}
				confirmLabel="Adicionar ao Calendário"
				cancelLabel="Cancelar"
				onConfirm={handleDragConfirm}
				variant="default"
			/>
		</div>
	);
}
