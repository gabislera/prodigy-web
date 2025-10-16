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
import { useTasks } from "@/hooks/use-tasks";
import type { Task, TaskColumn } from "@/types/tasks";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop<Task, object>(Calendar);

export function CalendarPage() {
	const { taskGroupsWithDetails } = useTaskGroupsWithDetails();
	const { updateTask } = useTasks();

	const [currentDate, setCurrentDate] = useState(new Date());
	const [isTaskSidebarOpen, setIsTaskSidebarOpen] = useState(false);
	const [viewType, setViewType] = useState<"month" | "week" | "day">("month");
	const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);

	const calendarTasks = useMemo(
		() =>
			taskGroupsWithDetails?.flatMap((group) =>
				group.columns
					.flatMap((column) => column.tasks || [])
					.filter((task) => task.startDate || task.endDate),
			) || [],
		[taskGroupsWithDetails],
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

	const handleDropFromOutside = async ({
		start,
		end,
	}: {
		start: Date | string;
		end: Date | string;
	}) => {
		// Buscar o taskId armazenado no drag
		const taskId = sessionStorage.getItem("draggingTaskId");
		if (!taskId) {
			console.warn("⚠️ Nenhuma task sendo arrastada");
			return;
		}

		const startDate = typeof start === "string" ? new Date(start) : start;
		const endDate = typeof end === "string" ? new Date(end) : end;

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
		console.log("Slot selecionado:", start);
	};

	const handleSelectTask = (task: Task) => {
		console.log("📋 Tarefa selecionada:", task);
		setSelectedTask(task);
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
			},
		};
	};

	const handleSidebarToggle = () => {
		setIsTaskSidebarOpen((prevState) => !prevState);
	};

	const handleTaskSave = async (taskData: {
		title: string;
		description: string;
		priority: "low" | "medium" | "high";
		columnId: string;
		completed: boolean;
		allDay: boolean;
		startDate?: string | null;
		endDate?: string | null;
	}) => {
		if (!selectedTask) return;

		try {
			await updateTask({
				taskId: selectedTask.id,
				data: taskData,
			});
			toast.success("Tarefa atualizada com sucesso!");
			setIsTaskDialogOpen(false);
			setSelectedTask(null);
		} catch (error) {
			console.error("Erro ao salvar tarefa:", error);
		}
	};

	return (
		<div className="flex h-[calc(100vh-80px)] pb-20 md:p-4 gap-4">
			<div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
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
							<CustomToolbar {...props} onSidebarToggle={handleSidebarToggle} />
						),
					}}
				/>
			</div>

			<div
				className={`transition-all duration-300 ease-in-out overflow-hidden ${
					isTaskSidebarOpen ? "w-80" : "w-0"
				}`}
			>
				<div className="w-80">
					<TasksSidebar taskGroupsWithDetails={taskGroupsWithDetails} />
				</div>
			</div>

			<TaskDialog
				isOpen={isTaskDialogOpen}
				onOpenChange={setIsTaskDialogOpen}
				task={selectedTask}
				columns={allColumns}
				onSave={handleTaskSave}
			/>
		</div>
	);
}
