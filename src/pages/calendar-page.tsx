import { useMemo, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { toast } from "sonner";
import moment from "@/lib/moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "@/styles/calendar.css";

import { CustomToolbar, TasksSidebar } from "@/components/calendar";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { useTaskGroupsWithDetails } from "@/hooks/use-task-groups-with-details";
import { useAllTasks, useTasks } from "@/hooks/use-tasks";
import type { ApiTask, Task, TaskColumn } from "@/types/tasks";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop<Task, object>(Calendar);

export function CalendarPage() {
	const { taskGroupsWithDetails } = useTaskGroupsWithDetails();
	const { updateTask, createTask } = useTasks();
	const { allTasks: allTasksFromApi } = useAllTasks();
	const getInitialCalendarSidebar = () => {
		if (typeof window === "undefined") return false;
		const stored = localStorage.getItem("calendar_sidebar_state");
		return stored ? JSON.parse(stored) : false;
	};

	const [isTaskSidebarOpen, setIsTaskSidebarOpen] = useState<boolean>(
		getInitialCalendarSidebar,
	);

	// Filter states
	const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
	const [completionFilter, setCompletionFilter] = useState<
		"all" | "completed" | "incomplete"
	>("all");

	const toggleCalendarSidebar = () => {
		setIsTaskSidebarOpen((prev) => {
			const next = !prev;
			localStorage.setItem("calendar_sidebar_state", JSON.stringify(next));
			return next;
		});
	};

	const [currentDate, setCurrentDate] = useState(new Date());
	const [viewType, setViewType] = useState<"month" | "week" | "day">("month");
	const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [initialStartDate, setInitialStartDate] = useState<Date | null>(null);
	const [initialEndDate, setInitialEndDate] = useState<Date | null>(null);

	const allTasks = useMemo(() => {
		const tasksFromGroups =
			taskGroupsWithDetails?.flatMap((group) =>
				group.columns.flatMap((column) =>
					column.tasks.map((task) => ({
						...task,
						groupId: group.id,
						groupName: group.name,
					})),
				),
			) || [];

		const tasksWithoutGroup = allTasksFromApi
			.filter((task: ApiTask) => !task.columnId)
			.map((task: ApiTask) => ({
				...task,
				groupId: null,
				groupName: "Sem grupo",
			}));

		const taskIds = new Set(tasksFromGroups.map((task: any) => task.id));
		const uniqueTasksWithoutGroup = tasksWithoutGroup.filter(
			(task: any) => !taskIds.has(task.id),
		);

		return [...tasksFromGroups, ...uniqueTasksWithoutGroup];
	}, [taskGroupsWithDetails, allTasksFromApi]);

	const calendarTasks = useMemo(
		() => allTasks.filter((task) => task.startDate || task.endDate),
		[allTasks],
	);

	const unscheduledTasks = useMemo(
		() => allTasks.filter((task) => !task.startDate && !task.endDate),
		[allTasks],
	);

	const allColumns = useMemo<TaskColumn[]>(
		() => taskGroupsWithDetails?.flatMap((group) => group.columns) || [],
		[taskGroupsWithDetails],
	);

	const handleTaskDrop = async ({
		event: task,
		start,
		end,
	}: {
		event: Task;
		start: Date | string;
		end: Date | string;
	}) => {
		const startDate = typeof start === "string" ? new Date(start) : start;
		const endDate = typeof end === "string" ? new Date(end) : end;

		// Validação: end deve ser maior ou igual a start
		if (endDate < startDate) {
			toast.error("Data final não pode ser anterior à data inicial");
			return;
		}

		try {
			await updateTask({
				taskId: task.id,
				data: {
					startDate: startDate.toISOString(),
					endDate: endDate.toISOString(),
				},
			});
			toast.success("Tarefa atualizada com sucesso!");
		} catch (error) {
			console.error("Erro ao mover tarefa:", error);
		}
	};

	const handleTaskResize = async ({
		event: task,
		start,
		end,
	}: {
		event: Task;
		start: Date | string;
		end: Date | string;
	}) => {
		const startDate = typeof start === "string" ? new Date(start) : start;
		const endDate = typeof end === "string" ? new Date(end) : end;

		// Validação: end deve ser maior que start
		if (endDate <= startDate) {
			toast.error("Data final deve ser posterior à data inicial");
			return;
		}

		try {
			await updateTask({
				taskId: task.id,
				data: {
					startDate: startDate.toISOString(),
					endDate: endDate.toISOString(),
				},
			});
			toast.success("Duração da tarefa atualizada!");
		} catch (error) {
			console.error("Erro ao redimensionar tarefa:", error);
		}
	};

	const handleDropFromOutside = async ({ start }: { start: Date | string }) => {
		// Buscar o taskId armazenado no drag
		const taskId = sessionStorage.getItem("draggingTaskId");
		if (!taskId) {
			console.warn("⚠️ Nenhuma task sendo arrastada");
			return;
		}

		const dropDate = typeof start === "string" ? new Date(start) : start;

		const now = new Date();
		const startDate = new Date(dropDate);
		startDate.setHours(now.getHours(), now.getMinutes(), 0, 0);

		const endDate = new Date(dropDate);
		endDate.setHours(now.getHours(), now.getMinutes() + 30, 0, 0);

		try {
			await updateTask({
				taskId,
				data: {
					startDate: startDate.toISOString(),
					endDate: endDate.toISOString(),
				},
			});
			toast.success("Tarefa adicionada ao calendário!");
			sessionStorage.removeItem("draggingTaskId");
		} catch (error) {
			console.error("Erro ao adicionar tarefa ao calendário:", error);
			sessionStorage.removeItem("draggingTaskId");
		}
	};

	const handleSelectSlot = ({ start }: { start: Date; end: Date }) => {
		setSelectedTask(null);

		const now = new Date();
		const startWithCurrentTime = new Date(start);
		startWithCurrentTime.setHours(now.getHours(), now.getMinutes(), 0, 0);

		const endWithCurrentTime = new Date(start);
		endWithCurrentTime.setHours(now.getHours(), now.getMinutes() + 30, 0, 0);

		setInitialStartDate(startWithCurrentTime);
		setInitialEndDate(endWithCurrentTime);
		setIsTaskDialogOpen(true);
	};

	const handleSelectTask = (task: Task | any) => {
		setSelectedTask(task);
		setInitialStartDate(null);
		setInitialEndDate(null);
		setIsTaskDialogOpen(true);
	};

	const taskStyleGetter = (task: Task) => {
		const priority = task.priority || "medium";
		const colorMap = {
			high: "#ef4444",
			medium: "#f59e0b",
			low: "#10b981",
		};

		return {
			style: {
				backgroundColor: colorMap[priority as keyof typeof colorMap],
				color: "white",
				borderRadius: "6px",
				border: "none",
				padding: "2px 4px",
				opacity: task.completed ? 0.5 : 1,
				textDecoration: task.completed ? "line-through" : "none",
				position: "relative" as const,
			},
		};
	};

	const CustomEvent = ({ event }: { event: Task }) => {
		return (
			<div style={{ position: "relative", height: "100%", width: "100%" }}>
				<span>{event.title}</span>
				{event.completed && (
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: 0,
							right: 0,
							height: "1px",
							backgroundColor: "white",
							transform: "translateY(-50%)",
							pointerEvents: "none",
						}}
					/>
				)}
			</div>
		);
	};

	const handleTaskSave = async (taskData: {
		title: string;
		description: string;
		priority: "low" | "medium" | "high";
		columnId?: string | null;
		completed: boolean;
		allDay: boolean;
		startDate?: string | null;
		endDate?: string | null;
	}) => {
		try {
			if (selectedTask) {
				await updateTask({
					taskId: selectedTask.id,
					data: taskData,
				});
				toast.success("Tarefa atualizada com sucesso!");
			} else {
				await createTask({
					...taskData,
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
			className={`flex h-[calc(100vh-80px)] pb-20 md:p-4 gap-0 ${isTaskSidebarOpen ? "gap-4" : ""}`}
		>
			<div className="flex-1 rounded-lg overflow-hidden">
				<DnDCalendar
					localizer={localizer}
					events={calendarTasks}
					titleAccessor={(task) => task.title}
					startAccessor={(task: Task) =>
						task.startDate ? new Date(task.startDate) : new Date()
					}
					endAccessor={(task: Task) =>
						task.endDate ? new Date(task.endDate) : new Date()
					}
					allDayAccessor={(task: Task) => Boolean(task.allDay)}
					date={currentDate}
					view={viewType}
					views={[Views.MONTH, Views.WEEK, Views.DAY]}
					onView={(v) => setViewType(v as "month" | "week" | "day")}
					onNavigate={(date) => setCurrentDate(date)}
					onEventDrop={handleTaskDrop}
					onEventResize={handleTaskResize}
					onDropFromOutside={handleDropFromOutside}
					selectable
					resizable
					draggableAccessor={() => true}
					style={{ height: "100%" }}
					eventPropGetter={taskStyleGetter}
					onSelectSlot={handleSelectSlot}
					onSelectEvent={handleSelectTask}
					popup
					components={{
						toolbar: (props) => (
							<CustomToolbar
								{...props}
								onSidebarToggle={toggleCalendarSidebar}
							/>
						),
						event: CustomEvent,
					}}
				/>
			</div>

			<div
				className={`transition-all duration-300 ease-in-out overflow-hidden h-full  ${
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
					onTaskClick={handleSelectTask}
				/>
			</div>

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
		</div>
	);
}
