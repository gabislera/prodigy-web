import type {
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
} from "@dnd-kit/core";
import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeft,
	BookOpen,
	Briefcase,
	Flag,
	Heart,
	Home,
	Plus,
	Star,
	Target,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Task, TaskGroup, TasksState } from "@/types/tasks";
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
	const [tasks, setTasks] = useState<TasksState>({
		todo: [
			{
				id: "1",
				title: "Estudar React Hooks",
				description: "Revisar useState, useEffect e custom hooks",
				priority: "high",
			},
			{
				id: "2",
				title: "Preparar apresentação",
				description: "Slides para reunião com cliente",
				priority: "medium",
			},
		],
		inProgress: [
			{
				id: "3",
				title: "Implementar autenticação",
				description: "Sistema de login com JWT",
				priority: "high",
			},
		],
		done: [
			{
				id: "4",
				title: "Setup do projeto",
				description: "Configurar Vite + React + TypeScript",
				priority: "low",
			},
		],
	});
	const [activeId, setActiveId] = useState<string | null>(null);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);

	const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([
		{
			id: "work",
			name: "Trabalho",
			icon: Briefcase,
			color: "text-primary",
			bgColor: "bg-primary/10",
			taskCount: 5,
			completedCount: 2,
		},
		{
			id: "study",
			name: "Estudo",
			icon: BookOpen,
			color: "text-accent",
			bgColor: "bg-accent/10",
			taskCount: 8,
			completedCount: 3,
		},
	]);

	const columns = [
		{
			id: "todo",
			title: "A Fazer",
			icon: Target,
			color: "text-muted-foreground",
			bgColor: "bg-muted/10",
		},
		{
			id: "inProgress",
			title: "Em Progresso",
			icon: Target,
			color: "text-warning",
			bgColor: "bg-warning/10",
		},
		{
			id: "done",
			title: "Concluído",
			icon: Flag,
			color: "text-success",
			bgColor: "bg-success/10",
		},
	];

	const handleSaveTask = (taskData: {
		title: string;
		description: string;
		priority: string;
	}) => {
		if (selectedTask) {
			// Modo de edição
			handleUpdateTask(selectedTask.id, taskData);
			setIsDetailDialogOpen(false);
		} else {
			// Modo de criação
			const task: Task = {
				id: Date.now().toString(),
				title: taskData.title,
				description: taskData.description,
				priority: taskData.priority as "high" | "medium" | "low",
			};

			setTasks((prev) => ({
				...prev,
				todo: [...prev.todo, task],
			}));
			setIsCreateDialogOpen(false);
		}
	};

	const handleCreateGroup = (groupData: {
		name: string;
		icon: string;
		color: string;
	}) => {
		const iconMap: Record<
			string,
			React.ComponentType<{ className?: string }>
		> = {
			briefcase: Briefcase,
			book: BookOpen,
			home: Home,
			users: Users,
			target: Target,
			heart: Heart,
			zap: Zap,
			star: Star,
		};

		const newGroup: TaskGroup = {
			id: Date.now().toString(),
			name: groupData.name,
			icon: iconMap[groupData.icon] || Briefcase,
			color: groupData.color,
			bgColor: groupData.color.replace("text-", "bg-") + "/10",
			taskCount: 0,
			completedCount: 0,
		};

		setTaskGroups((prev) => [...prev, newGroup]);
	};

	const handleUpdateTask = (
		taskId: string,
		updatedTask: { title: string; description: string; priority: string },
	) => {
		setTasks((prev) => {
			const newTasks = { ...prev };

			// Find and update the task in any column
			Object.keys(newTasks).forEach((columnKey) => {
				const column = columnKey as keyof typeof newTasks;
				const taskIndex = newTasks[column].findIndex(
					(task) => task.id === taskId,
				);
				if (taskIndex !== -1) {
					newTasks[column][taskIndex] = {
						...newTasks[column][taskIndex],
						title: updatedTask.title,
						description: updatedTask.description,
						priority: updatedTask.priority as "high" | "medium" | "low",
					};
				}
			});

			return newTasks;
		});
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

		const activeColumn = Object.keys(tasks).find((key) =>
			tasks[key as keyof typeof tasks].some((task) => task.id === activeId),
		) as keyof typeof tasks | undefined;

		let overColumn = Object.keys(tasks).find((key) =>
			tasks[key as keyof typeof tasks].some((task) => task.id === overId),
		) as keyof typeof tasks | undefined;

		if (["todo", "inProgress", "done"].includes(overId)) {
			overColumn = overId as keyof typeof tasks;
		}

		if (!activeColumn || !overColumn) return;

		if (activeColumn !== overColumn) {
			setTasks((prev) => {
				const activeTask = prev[activeColumn].find(
					(task) => task.id === activeId,
				);
				if (!activeTask) return prev;

				return {
					...prev,
					[activeColumn]: prev[activeColumn].filter(
						(task) => task.id !== activeId,
					),
					[overColumn]: [...prev[overColumn], activeTask],
				};
			});
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);

		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		const activeColumn = Object.keys(tasks).find((key) =>
			tasks[key as keyof typeof tasks].some((task) => task.id === activeId),
		) as keyof typeof tasks | undefined;

		if (!activeColumn) return;

		const activeIndex = tasks[activeColumn].findIndex(
			(task) => task.id === activeId,
		);
		const overIndex = tasks[activeColumn].findIndex(
			(task) => task.id === overId,
		);

		if (activeIndex !== overIndex && overIndex !== -1) {
			setTasks((prev) => {
				const newTasks = [...prev[activeColumn]];
				const [movedTask] = newTasks.splice(activeIndex, 1);
				newTasks.splice(overIndex, 0, movedTask);

				return {
					...prev,
					[activeColumn]: newTasks,
				};
			});
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
							{group && <group.icon className={`h-5 w-5 ${group.color}`} />}
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
					tasks={tasks}
					columns={columns}
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
							{taskGroups.reduce((acc, group) => acc + group.taskCount, 0)}
						</div>
						<p className="text-xs text-muted-foreground">Total de Tarefas</p>
					</div>
					<div>
						<div className="text-xl font-bold text-success">
							{taskGroups.reduce((acc, group) => acc + group.completedCount, 0)}
						</div>
						<p className="text-xs text-muted-foreground">Concluídas</p>
					</div>
				</div>
			</Card>

			<CreateGroupDialog
				isOpen={isCreateGroupDialogOpen}
				onOpenChange={setIsCreateGroupDialogOpen}
				onCreateGroup={handleCreateGroup}
			/>

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
