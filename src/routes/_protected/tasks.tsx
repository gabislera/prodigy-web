import type {
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
} from "@dnd-kit/core";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Plus, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/use-tasks";
import type { Task, TaskColumn, TaskGroup } from "@/types/tasks";
import {
	CreateGroupDialog,
	GroupCard,
	KanbanBoard,
	SettingsDialog,
	TaskDialog,
} from "../../components/tasks";

export const Route = createFileRoute("/_protected/tasks")({
	component: TasksPage,
});

function TasksPage() {
	const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
	const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [editingGroup, setEditingGroup] = useState<TaskGroup | null>(null);

	const {
		taskGroups,
		taskColumns: apiTaskColumns,
		createTask,
		updateTask,
		deleteTask,
		updateColumnOrder,
		deleteTaskGroup,
	} = useTasks(selectedGroup);

	// Convert ApiTaskColumn[] to TaskColumn[]
	const taskColumns: TaskColumn[] = apiTaskColumns.map((apiColumn) => ({
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
			createdAt: apiTask.createdAt,
			updatedAt: apiTask.updatedAt,
		})),
	}));

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
		priority: string;
		columnId?: string;
		completed: boolean;
	}) => {
		if (selectedTask) {
			// Modo de edição
			await handleUpdateTask(selectedTask.id, taskData);
			setIsDetailDialogOpen(false);
		} else {
			// Modo de criação - usar columnId selecionada pelo usuário
			if (taskData.columnId) {
				try {
					await createTask({
						title: taskData.title,
						description: taskData.description,
						priority: taskData.priority as "high" | "medium" | "low",
						columnId: taskData.columnId,
						position: 0,
						completed: taskData.completed,
					});

					setIsCreateDialogOpen(false);
				} catch (error) {
					console.error("Erro ao criar tarefa:", error);
					// TODO: Mostrar notificação de erro para o usuário
				}
			} else {
				console.error("Coluna é obrigatória para criar a tarefa");
				// TODO: Mostrar notificação de erro para o usuário
			}
		}
	};

	const handleUpdateTask = async (
		taskId: string,
		updatedTask: {
			title: string;
			description: string;
			priority: string;
			completed: boolean;
		},
	) => {
		try {
			await updateTask({
				taskId,
				data: {
					title: updatedTask.title,
					description: updatedTask.description,
					priority: updatedTask.priority as "high" | "medium" | "low",
					completed: updatedTask.completed,
				},
			});
		} catch (error) {
			console.error("Erro ao atualizar tarefa:", error);
			// TODO: Mostrar notificação de erro para o usuário
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
		const group = taskGroups.find((g) => g.id === selectedGroup);

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
						<div className="flex items-center gap-2">
							{/* {group && <group.icon className={`h-5 w-5 ${group.color}`} />} */}
							<h1 className="text-xl font-bold text-foreground">
								{group?.name || "Tarefas"}
							</h1>
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

	// Groups View
	return (
		<div className="p-4 pb-24 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-bold text-foreground">Grupos de Tarefas</h1>
				<Button
					className="bg-gradient-primary border-0 shadow-glow text-xs"
					onClick={() => setIsCreateGroupDialogOpen(true)}
				>
					<Plus className="h-3 w-3 mr-1" />
					Novo Grupo
				</Button>
			</div>

			{/* Groups Grid */}
			<div className="flex flex-wrap gap-4">
				{taskGroups.map((group) => (
					<div key={group.id} className="w-80 flex-shrink-0">
						<GroupCard
							group={group}
							onGroupClick={setSelectedGroup}
							onEditGroup={handleEditGroup}
							onDeleteGroup={handleDeleteGroup}
						/>
					</div>
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
				// onCreateGroup={handleCreateGroup}
			/>

			<TaskDialog
				isOpen={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
				onSave={handleSaveTask}
			/>
		</div>
	);
}
