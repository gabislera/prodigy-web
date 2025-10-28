import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, Search, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ColumnDialog } from "@/components/tasks/column-dialog";
import { CreateGroupDialog } from "@/components/tasks/create-group-dialog";
import { GroupCard } from "@/components/tasks/group-card";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { SettingsDialog } from "@/components/tasks/settings-dialog";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop";
import { useGroupColumns } from "@/hooks/use-group-columns";
import { useTaskColumns } from "@/hooks/use-task-columns";
import { useTaskGroups } from "@/hooks/use-task-groups";
import { useTasks } from "@/hooks/use-tasks";
import type { Task, TaskColumn, TaskGroup } from "@/types/tasks";

export function TasksPage() {
	const navigate = useNavigate();
	const params = useParams({ strict: false });
	const groupIdFromUrl = (params as { groupId?: string }).groupId;

	const [selectedGroup, setSelectedGroup] = useState<string | null>(groupIdFromUrl || null);

	// Sync selectedGroup with URL param
	useEffect(() => {
		if (groupIdFromUrl) {
			setSelectedGroup(groupIdFromUrl);
		}
	}, [groupIdFromUrl]);
	const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
	const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
	const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [editingGroup, setEditingGroup] = useState<TaskGroup | null>(null);
	const [editingColumn, setEditingColumn] = useState<TaskColumn | null>(null);
	const [optimisticTaskColumns, setOptimisticTaskColumns] = useState<
		TaskColumn[] | null
	>(null);

	const { taskGroups, deleteTaskGroup } = useTaskGroups();
	const { columns: groupColumns, isLoading: isLoadingColumns } = useGroupColumns(selectedGroup);
	const {
		updateColumnOrder,
		createTaskColumn,
		updateTaskColumn,
		deleteTaskColumn,
	} = useTaskColumns();
	const { createTask, updateTask, deleteTask } = useTasks();

	// Use optimistic state if available, otherwise use base state
	const taskColumns = useMemo(() => {
		return optimisticTaskColumns || groupColumns;
	}, [optimisticTaskColumns, groupColumns]);

	// Function to update optimistic state
	const updateOptimisticState = (newColumns: TaskColumn[]) => {
		setOptimisticTaskColumns(newColumns);
	};

	// Function to reset optimistic state
	const resetOptimisticState = () => {
		setOptimisticTaskColumns(null);
	};

	// Drag and drop functionality
	const { activeId, handleDragStart, handleDragOver, handleDragEnd } =
		useDragAndDrop({
			taskColumns,
			onOptimisticUpdate: updateOptimisticState,
			onResetOptimistic: resetOptimisticState,
		});

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
			await handleUpdateTask(selectedTask.id, taskData);
		}
		setIsDetailDialogOpen(false);
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
			const task = taskColumns
				.flatMap((col) => col.tasks)
				.find((t) => t.id === taskId);

			const updateData: {
				title: string;
				description: string;
				priority: "high" | "medium" | "low";
				completed: boolean;
				startDate?: string | null;
				endDate?: string | null;
				allDay?: boolean;
				status?: string;
				type?: "task" | "event";
			} = {
				title: updatedTask.title,
				description: updatedTask.description,
				priority: updatedTask.priority,
				completed: updatedTask.completed,
				startDate: updatedTask.startDate,
				endDate: updatedTask.endDate,
				allDay: updatedTask.allDay,
				status: "pending",
				...(task?.type && { type: task.type }),
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
			// Find the task to preserve its type
			const task = taskColumns
				.flatMap((col) => col.tasks)
				.find((t) => t.id === taskId);

			await updateTask({
				taskId,
				data: {
					columnId,
					...(task?.type && { type: task.type }),
				},
			});
		} catch (error) {
			console.error("Erro ao mover task:", error);
		}
	};

	const handleToggleComplete = async (taskId: string, completed: boolean) => {
		try {
			const task = taskColumns
				.flatMap((col) => col.tasks)
				.find((t) => t.id === taskId);

			await updateTask({
				taskId,
				data: {
					completed,
					...(task?.type && { type: task.type }),
				},
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
				navigate({ to: "/tasks" });
			}
		} catch (error) {
			console.error("Erro ao deletar grupo:", error);
		}
	};

	const handleGroupClick = (groupId: string) => {
		setSelectedGroup(groupId);
		navigate({ to: `/tasks/${groupId}` });
	};

	const handleBackToGroups = () => {
		setSelectedGroup(null);
		navigate({ to: "/tasks" });
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

	const handleEditColumn = (column: TaskColumn) => {
		setEditingColumn(column);
		setIsColumnDialogOpen(true);
	};

	const handleDeleteColumn = async (columnId: string) => {
		await deleteTaskColumn(columnId);
	};

	const handleQuickCreateTask = async (columnId: string) => {
		try {
			const column = taskColumns.find((col) => col.id === columnId);
			const nextPosition = column?.tasks.length || 0;

			await createTask({
				title: "Nova Tarefa",
				description: "",
				priority: "low",
				columnId,
				position: nextPosition,
				completed: false,
				startDate: null,
				endDate: null,
				allDay: false,
				status: "pending",
			});
		} catch (error) {
			console.error("Erro ao criar tarefa:", error);
			toast.error("Erro ao criar tarefa. Tente novamente.");
		}
	};

	const handleCreateColumn = () => {
		setEditingColumn(null);
		setIsColumnDialogOpen(true);
	};

	const handleSaveColumn = async (title: string, columnId?: string) => {
		if (!selectedGroup) return;

		if (columnId) {
			// Editar coluna existente
			await updateTaskColumn({ columnId, title });
		} else {
			// Criar nova coluna
			const nextOrder = taskColumns.length;
			await createTaskColumn({
				groupId: selectedGroup,
				title,
				order: nextOrder,
			});
		}
	};

	if (selectedGroup) {
		const group = taskGroups.find((g) => g.id === selectedGroup);

		if (isLoadingColumns) {
			return (
				<div className="flex items-center justify-center h-full">
					<p className="text-muted-foreground">Carregando tarefas...</p>
				</div>
			);
		}

		return (
			<div className="flex flex-col h-full overflow-hidden">
				{/* Header */}

				<div className="flex-shrink-0 p-4 flex items-center justify-between border-b border-border/50">
					<div className="flex items-center gap-3">
						<Button
							variant="ghost"
							size="icon"
							onClick={handleBackToGroups}
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
							onClick={handleCreateColumn}
						>
							<Plus className="h-3 w-3 mr-1" />
							Nova Coluna
						</Button>
					</div>
				</div>

				{/* Kanban Board */}

				<div className="flex-1 overflow-hidden p-4 pb-0">
					<KanbanBoard
						columns={taskColumns}
						onTaskClick={handleTaskClick}
						onDeleteTask={handleDeleteTask}
						onMoveTask={handleMoveTask}
						onToggleComplete={handleToggleComplete}
						onDragStart={handleDragStart}
						onDragOver={handleDragOver}
						onDragEnd={handleDragEnd}
						onEditColumn={handleEditColumn}
						onDeleteColumn={handleDeleteColumn}
						onQuickCreateTask={handleQuickCreateTask}
						activeId={activeId}
					/>
				</div>

				{/* Dialogs */}
				{selectedTask && (
					<TaskDialog
						isOpen={isDetailDialogOpen}
						onOpenChange={setIsDetailDialogOpen}
						task={selectedTask}
						onSave={handleSaveTask}
					/>
				)}

				<SettingsDialog
					isOpen={isSettingsDialogOpen}
					onOpenChange={setIsSettingsDialogOpen}
					columns={taskColumns}
					onSaveColumnOrder={handleSaveColumnOrder}
				/>

				<ColumnDialog
					isOpen={isColumnDialogOpen}
					onOpenChange={(open) => {
						setIsColumnDialogOpen(open);
						if (!open) {
							setEditingColumn(null);
						}
					}}
					editingColumn={editingColumn}
					onSave={handleSaveColumn}
				/>
			</div>
		);
	}

	const visibleGroups = taskGroups;

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
						onGroupClick={handleGroupClick}
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
		</div>
	);
}
