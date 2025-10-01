import type {
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
} from "@dnd-kit/core";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTasks } from "@/hooks/use-tasks";
import type { Task } from "@/types/tasks";
import {
	CreateGroupDialog,
	GroupCard,
	KanbanBoard,
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
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);

	const { taskGroups, taskColumns, createTask, updateTask } =
		useTasks(selectedGroup);

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
	}) => {
		if (selectedTask) {
			// Modo de edição - TODO: implementar atualização de tarefa
			handleUpdateTask(selectedTask.id, taskData);
			setIsDetailDialogOpen(false);
		} else {
			// Modo de criação - usar columnId específica ou primeira coluna do grupo
			let targetColumnId = taskData.columnId;

			if (!targetColumnId && selectedGroup && taskColumns.length > 0) {
				// Usar a primeira coluna disponível do grupo selecionado
				targetColumnId = taskColumns[0].id;
			}

			if (targetColumnId) {
				try {
					await createTask({
						title: taskData.title,
						description: taskData.description,
						priority: taskData.priority as "high" | "medium" | "low",
						columnId: targetColumnId,
						position: 0,
					});

					setIsCreateDialogOpen(false);
				} catch (error) {
					console.error("Erro ao criar tarefa:", error);
					// TODO: Mostrar notificação de erro para o usuário
				}
			} else {
				console.error("Nenhuma coluna disponível para criar a tarefa");
				// TODO: Mostrar notificação de erro para o usuário
			}
		}
	};

	const handleUpdateTask = (
		taskId: string,
		updatedTask: { title: string; description: string; priority: string },
	) => {
		// TODO: Implementar atualização de tarefa no backend
		console.log("Atualizar tarefa:", taskId, updatedTask);
	};

	const handleTaskClick = (task: Task) => {
		setSelectedTask(task);
		setIsDetailDialogOpen(true);
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
					<Button
						className="bg-gradient-primary border-0 shadow-glow text-xs"
						onClick={() => setIsCreateDialogOpen(true)}
					>
						<Plus className="h-3 w-3 mr-1" />
						Nova Tarefa
					</Button>
				</div>

				{/* Kanban Board */}
				<KanbanBoard
					columns={taskColumns}
					onTaskClick={handleTaskClick}
					onCreateTask={() => setIsCreateDialogOpen(true)}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
					activeId={activeId}
				/>

				{/* Dialogs */}
				<TaskDialog
					isOpen={isCreateDialogOpen}
					onOpenChange={setIsCreateDialogOpen}
					onSave={handleSaveTask}
				/>

				<TaskDialog
					isOpen={isDetailDialogOpen}
					onOpenChange={setIsDetailDialogOpen}
					task={selectedTask}
					onSave={handleSaveTask}
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
						<GroupCard group={group} onGroupClick={setSelectedGroup} />
					</div>
				))}
			</div>

			{/* Quick Stats */}
			<Card className="p-4 bg-gradient-card border-border/50">
				<div className="grid grid-cols-2 gap-4 text-center">
					<div>
						<div className="text-xl font-bold text-primary">
							{/* {taskGroups.reduce((acc, group) => acc + group.taskCount, 0)} */}
						</div>
						<p className="text-xs text-muted-foreground">Total de Tarefas</p>
					</div>
					<div>
						<div className="text-xl font-bold text-success">
							{/* {taskGroups.reduce((acc, group) => acc + group.completedCount, 0)} */}
						</div>
						<p className="text-xs text-muted-foreground">Concluídas</p>
					</div>
				</div>
			</Card>

			<CreateGroupDialog
				isOpen={isCreateGroupDialogOpen}
				onOpenChange={setIsCreateGroupDialogOpen}
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
