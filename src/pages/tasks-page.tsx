import type {
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
} from "@dnd-kit/core";
import { ArrowLeft, Plus, Search, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateGroupDialog } from "@/components/tasks/create-group-dialog";
import { GroupCard } from "@/components/tasks/group-card";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { SettingsDialog } from "@/components/tasks/settings-dialog";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskGroupsWithDetails } from "@/hooks/use-task-groups-with-details";
import { useTasks } from "@/hooks/use-tasks";
import type { Task, TaskColumn, TaskGroup } from "@/types/tasks";

export function TasksPage() {
	const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
	const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [editingGroup, setEditingGroup] = useState<TaskGroup | null>(null);

	const { taskGroupsWithDetails, deleteTaskGroup, updateColumnOrder } =
		useTaskGroupsWithDetails();
	const { createTask, updateTask, deleteTask } = useTasks(selectedGroup);

	// Get group data from cache
	const selectedGroupData = taskGroupsWithDetails.find(
		(g) => g.id === selectedGroup,
	);

	// Convert ApiTaskColumn[] to TaskColumn[]
	const taskColumns: TaskColumn[] =
		selectedGroupData?.columns.map((apiColumn) => ({
			id: apiColumn.id,
			title: apiColumn.title,
			groupId: apiColumn.groupId,
			order: apiColumn.order,
			tasks: apiColumn.tasks.map((apiTask) => ({
				id: apiTask.id,
				title: apiTask.title,
				description: apiTask.description,
				priority: apiTask.priority,
				columnId: apiTask.columnId,
				position: apiTask.position,
				completed: apiTask.completed,
				startDate: apiTask.startDate,
				endDate: apiTask.endDate,
				allDay: apiTask.allDay,
				status: apiTask.status,
				type: apiTask.type,
				createdAt: apiTask.createdAt,
				updatedAt: apiTask.updatedAt,
			})),
		})) || [];

	// Helper function to calculate new positions when reordering within the same column
	const calculateNewPositions = (
		columns: typeof taskColumns,
		activeId: string,
		overId: string,
		targetColumnId: string,
	) => {
		const targetColumn = columns.find((col) => col.id === targetColumnId);
		if (!targetColumn) return [];

		const columnTasks = targetColumn.tasks;
		const activeTaskIndex = columnTasks.findIndex(
			(task) => task.id === activeId,
		);
		const overTaskIndex = columnTasks.findIndex((task) => task.id === overId);

		if (activeTaskIndex === -1 || overTaskIndex === -1) return [];

		const newTasks = [...columnTasks];
		const [movedTask] = newTasks.splice(activeTaskIndex, 1);

		// Insert at the new position
		if (activeTaskIndex < overTaskIndex) {
			newTasks.splice(overTaskIndex - 1, 0, movedTask);
		} else {
			newTasks.splice(overTaskIndex, 0, movedTask);
		}

		// Return updates for all affected tasks
		return newTasks.map((task, index) => ({
			taskId: task.id,
			position: index,
		}));
	};

	const handleSaveTask = async (taskData: {
		title: string;
		description: string;
		priority: "low" | "medium" | "high";
		columnId?: string | null;
		completed: boolean;
		allDay: boolean;
		startDate?: string | null;
		endDate?: string | null;
	}) => {
		if (selectedTask) {
			// Modo de edição
			await handleUpdateTask(selectedTask.id, taskData);
			setIsDetailDialogOpen(false);
		} else {
			// Modo de criação - usar columnId selecionada pelo usuário
			if (taskData.columnId) {
				try {
					const createData: {
						title: string;
						description: string;
						priority: "high" | "medium" | "low";
						columnId: string;
						position: number;
						completed: boolean;
						startDate?: string | null;
						endDate?: string | null;
						allDay?: boolean;
						status?: string;
					} = {
						title: taskData.title,
						description: taskData.description,
						priority: taskData.priority as "high" | "medium" | "low",
						columnId: taskData.columnId,
						position: 0,
						completed: taskData.completed,
						startDate: taskData.startDate,
						endDate: taskData.endDate,
						allDay: false,
						status: "pending",
					};

					await createTask(createData);

					toast.success("Tarefa criada com sucesso!");
					setIsCreateDialogOpen(false);
				} catch (error) {
					console.error("Erro ao criar tarefa:", error);
					toast.error("Erro ao criar tarefa. Tente novamente.");
				}
			} else {
				console.error("Coluna é obrigatória para criar a tarefa");
				toast.error("Selecione uma coluna para criar a tarefa.");
			}
		}
	};

	const handleUpdateTask = async (
		taskId: string,
		updatedTask: {
			title: string;
			description: string;
			priority: "low" | "medium" | "high";
			completed: boolean;
			allDay: boolean;
			startDate?: string | null;
			endDate?: string | null;
		},
	) => {
		try {
			const updateData: {
				title: string;
				description: string;
				priority: "high" | "medium" | "low";
				completed: boolean;
				startDate?: string | null;
				endDate?: string | null;
				allDay?: boolean;
				status?: string;
			} = {
				title: updatedTask.title,
				description: updatedTask.description,
				priority: updatedTask.priority,
				completed: updatedTask.completed,
				startDate: updatedTask.startDate,
				endDate: updatedTask.endDate,
				allDay: updatedTask.allDay,
				status: "pending",
			};

			await updateTask({
				taskId,
				data: updateData,
			});

			toast.success("Tarefa atualizada com sucesso!");
		} catch (error) {
			console.error("Erro ao atualizar tarefa:", error);
			toast.error("Erro ao atualizar tarefa. Tente novamente.");
		}
	};

	const handleTaskClick = (task: Task) => {
		setSelectedTask(task);
		setIsDetailDialogOpen(true);
	};

	const handleDeleteTask = async (taskId: string) => {
		try {
			await deleteTask(taskId);
		} catch (error) {
			console.error("Erro ao deletar task:", error);
		}
	};

	const handleMoveTask = async (taskId: string, columnId: string) => {
		try {
			await updateTask({
				taskId,
				data: { columnId },
			});
		} catch (error) {
			console.error("Erro ao mover task:", error);
		}
	};

	const handleToggleComplete = async (taskId: string, completed: boolean) => {
		try {
			await updateTask({
				taskId,
				data: { completed },
			});
		} catch (error) {
			console.error("Erro ao atualizar status da task:", error);
		}
	};

	const handleEditGroup = (group: TaskGroup) => {
		setEditingGroup(group);
		setIsCreateGroupDialogOpen(true);
	};

	const handleDeleteGroup = async (groupId: string) => {
		try {
			await deleteTaskGroup(groupId);

			if (selectedGroup === groupId) {
				setSelectedGroup(null);
			}
		} catch (error) {
			console.error("Erro ao deletar grupo:", error);
		}
	};

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;

		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		// Find the active task
		const activeTask = taskColumns
			.flatMap((col) => col.tasks)
			.find((task) => task.id === activeId);

		if (!activeTask) return;

		// If dropping on a column or another task
		if (overId !== activeId) {
			// Check if dropping on a different column
			const activeColumn = taskColumns.find((column) =>
				column.tasks?.some((task) => task.id === activeId),
			);

			// Determine target column
			let targetColumn = overId;

			// If dropping on a task, get its column
			const overTask = taskColumns
				.flatMap((col) => col.tasks || [])
				.find((task) => task.id === overId);

			if (overTask) {
				targetColumn =
					taskColumns.find((column) =>
						column.tasks?.some((task) => task.id === overId),
					)?.id || overId;
			}

			if (activeColumn?.id !== targetColumn) {
				// Task is being moved to a different column
				// We'll handle this in handleDragEnd
			}
		}
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);

		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		// Find the active task
		const activeTask = taskColumns
			.flatMap((col) => col.tasks)
			.find((task) => task.id === activeId);

		if (!activeTask) return;

		// Find current column of the task
		const currentColumn = taskColumns.find((column) =>
			column.tasks?.some((task) => task.id === activeId),
		);

		// Determine target column and position
		let targetColumn = overId;
		let targetPosition = 0;

		// If dropping on a task, get its column and calculate position
		const overTask = taskColumns
			.flatMap((col) => col.tasks)
			.find((task) => task.id === overId);

		if (overTask) {
			// Dropping on another task
			const overColumn = taskColumns.find((column) =>
				column.tasks.some((task) => task.id === overId),
			);
			targetColumn = overColumn?.id || overId;

			// Get all tasks in the target column
			const targetColumnTasks = overColumn?.tasks || [];
			const overTaskIndex = targetColumnTasks.findIndex(
				(task) => task.id === overId,
			);

			if (overTaskIndex !== -1) {
				// Position after the task we're dropping on
				targetPosition = overTaskIndex + 1;
			}
		} else {
			// Dropping on a column
			targetColumn = overId;
			// Position at the end of the column
			const targetColumnData = taskColumns.find((col) => col.id === overId);
			targetPosition = (targetColumnData?.tasks || []).length;
		}

		// Only update if there's a change
		if (
			currentColumn?.id !== targetColumn ||
			targetPosition !== activeTask.position
		) {
			try {
				// If moving within the same column, update all affected tasks
				if (currentColumn?.id === targetColumn && overTask) {
					const positionUpdates = calculateNewPositions(
						taskColumns,
						activeId,
						overId,
						targetColumn,
					);

					// Update all affected tasks
					await Promise.all(
						positionUpdates.map(({ taskId, position }) =>
							updateTask({
								taskId,
								data: { position },
							}),
						),
					);
				} else {
					// Moving to a different column or to empty space
					await updateTask({
						taskId: activeId,
						data: {
							columnId: targetColumn,
							position: targetPosition,
						},
					});
				}
			} catch (error) {
				console.error("Erro ao mover task:", error);
			}
		}
	};

	const handleSaveColumnOrder = async (newColumns: TaskColumn[]) => {
		if (!selectedGroup) return;

		try {
			const columnOrders = newColumns.map((column, index) => ({
				columnId: column.id,
				order: index,
			}));

			await updateColumnOrder({ groupId: selectedGroup, columnOrders });
		} catch (error) {
			console.error("Erro ao salvar ordem das colunas:", error);
		}
	};

	if (selectedGroup) {
		const group = taskGroupsWithDetails.find((g) => g.id === selectedGroup);

		return (
			<div className="p-4 pb-24 space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setSelectedGroup(null)}
							className="h-8 w-8"
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<div>
							<h1 className="text-xl font-bold text-foreground">
								{group?.name || "Tarefas"}
							</h1>
							{group?.description && (
								<p className="text-sm text-muted-foreground mt-0.5">
									{group.description}
								</p>
							)}
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							onClick={() => setIsSettingsDialogOpen(true)}
							className="h-8 w-8"
						>
							<Settings className="h-4 w-4" />
						</Button>
						<Button
							className="bg-gradient-primary border-0 shadow-glow text-xs"
							onClick={() => setIsCreateDialogOpen(true)}
						>
							<Plus className="h-3 w-3 mr-1" />
							Nova Tarefa
						</Button>
					</div>
				</div>

				{/* Kanban Board */}
				<KanbanBoard
					columns={taskColumns}
					onTaskClick={handleTaskClick}
					onDeleteTask={handleDeleteTask}
					onMoveTask={handleMoveTask}
					onToggleComplete={handleToggleComplete}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
					activeId={activeId}
				/>

				{/* Dialogs */}
				<TaskDialog
					isOpen={isCreateDialogOpen}
					onOpenChange={setIsCreateDialogOpen}
					columns={taskColumns}
					onSave={handleSaveTask}
				/>

				<TaskDialog
					isOpen={isDetailDialogOpen}
					onOpenChange={setIsDetailDialogOpen}
					task={selectedTask}
					onSave={handleSaveTask}
				/>

				<SettingsDialog
					isOpen={isSettingsDialogOpen}
					onOpenChange={setIsSettingsDialogOpen}
					columns={taskColumns}
					onSaveColumnOrder={handleSaveColumnOrder}
				/>
			</div>
		);
	}

	const visibleGroups = taskGroupsWithDetails;

	return (
		<div className="p-4 pb-24 space-y-6">
			<div className="flex items-center justify-between">
				<div className="relative">
					<Search
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
						size={16}
					/>
					<Input
						placeholder="Buscar grupos..."
						className="pl-9 bg-card border-border"
						disabled
					/>
				</div>
				{/* <div className="flex items-center gap-2">
						<Filter className="text-primary" size={20} />
					</div> */}
				<Button
					className="bg-gradient-primary shadow-glow"
					onClick={() => setIsCreateGroupDialogOpen(true)}
				>
					<Plus size={16} />
					Novo Grupo
				</Button>
			</div>

			{/* Groups Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{visibleGroups.map((group) => (
					<GroupCard
						key={group.id}
						group={group}
						onGroupClick={setSelectedGroup}
						onEditGroup={handleEditGroup}
						onDeleteGroup={handleDeleteGroup}
					/>
				))}
			</div>

			<CreateGroupDialog
				isOpen={isCreateGroupDialogOpen}
				onOpenChange={(open) => {
					setIsCreateGroupDialogOpen(open);
					if (!open) {
						setEditingGroup(null);
					}
				}}
				editingGroup={editingGroup}
			/>

			<TaskDialog
				isOpen={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
				onSave={handleSaveTask}
			/>
		</div>
	);
}
