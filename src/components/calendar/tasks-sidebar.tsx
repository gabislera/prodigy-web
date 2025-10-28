import { GripVertical } from "lucide-react";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ApiTaskGroup } from "@/types/tasks";

interface TaskWithGroup {
	id: string;
	title: string;
	description: string;
	priority: "high" | "medium" | "low";
	startDate?: string | null;
	completed: boolean;
	groupId: string | null;
	groupName: string;
	type?: "task" | "event";
}

interface TasksSidebarProps {
	allTasks: TaskWithGroup[];
	taskGroupsWithDetails: ApiTaskGroup[];
	selectedGroupIds: string[];
	setSelectedGroupIds: (ids: string[]) => void;
	completionFilter: "all" | "completed" | "incomplete";
	setCompletionFilter: (filter: "all" | "completed" | "incomplete") => void;
	onTaskClick?: (task: TaskWithGroup) => void;
}

export const TasksSidebar = ({
	allTasks,
	taskGroupsWithDetails,
	selectedGroupIds,
	setSelectedGroupIds,
	completionFilter,
	setCompletionFilter,
	onTaskClick,
}: TasksSidebarProps) => {
	const filteredTasks = useMemo(() => {
		let filtered = allTasks;

		// Filter by group
		if (selectedGroupIds.length > 0) {
			filtered = filtered.filter((task) => {
				if (selectedGroupIds.includes("no-group") && !task.groupId) {
					return true;
				}
				if (task.groupId && selectedGroupIds.includes(task.groupId)) {
					return true;
				}
				return false;
			});
		}

		// Filter by completion
		if (completionFilter === "completed") {
			filtered = filtered.filter((task) => task.completed);
		} else if (completionFilter === "incomplete") {
			filtered = filtered.filter((task) => !task.completed);
		}

		// Filter out events (tasks that are already in calendar)
		filtered = filtered.filter((task) => task.type !== "event");

		return filtered;
	}, [allTasks, selectedGroupIds, completionFilter]);
	return (
		<div className="h-full bg-card rounded-lg border border-border p-4 overflow-y-auto flex flex-col gap-4">
			<div className="space-y-3">
				<h2 className="text-lg font-semibold">Tarefas</h2>
				<p className="text-xs text-muted-foreground">
					Arraste as tarefas para o calendário
				</p>
				<div className="flex gap-2">
					<Select
						value={selectedGroupIds.length === 1 ? selectedGroupIds[0] : "all"}
						onValueChange={(value) => {
							if (value === "all") {
								setSelectedGroupIds([]);
							} else {
								setSelectedGroupIds([value]);
							}
						}}
					>
						<SelectTrigger size="sm" className="w-1/2">
							<SelectValue placeholder="Grupo" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Todos</SelectItem>
							{taskGroupsWithDetails.map((group) => (
								<SelectItem
									key={group.id}
									value={group.id}
									className="truncate"
								>
									<span className="truncate">{group.name}</span>
								</SelectItem>
							))}
							<SelectItem value="no-group">Sem grupo</SelectItem>
						</SelectContent>
					</Select>

					<Select value={completionFilter} onValueChange={setCompletionFilter}>
						<SelectTrigger size="sm" className="w-1/2">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Todos</SelectItem>
							<SelectItem value="incomplete">Não concluídas</SelectItem>
							<SelectItem value="completed">Concluídas</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent">
				{filteredTasks.length === 0 ? (
					<p className="text-sm text-muted-foreground text-center py-8">
						Nenhuma tarefa encontrada
					</p>
				) : (
					filteredTasks.map((task) => (
						<button
							type="button"
							key={task.id}
							draggable={true}
							onDragStart={(e) => {
								sessionStorage.setItem("draggingTaskId", task.id);
								e.dataTransfer.effectAllowed = "move";
								e.currentTarget.classList.add("opacity-50");
							}}
							onDragEnd={(e) => e.currentTarget.classList.remove("opacity-50")}
							className="w-full text-left cursor-grab active:cursor-grabbing"
						>
							<Card
								className="p-4 hover:shadow-lg transition-all cursor-pointer bg-card group"
								onClick={() => onTaskClick?.(task)}
							>
								<div className="space-y-3">
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-center gap-2 flex-1 min-w-0">
											<GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
											<p className="text-sm font-medium flex-1 line-clamp-2">
												{task.title}
											</p>
										</div>
										<span
											className={cn(
												"rounded-full w-2 h-2",
												task.priority === "high" && "bg-destructive",
												task.priority === "medium" && "bg-warning",
												task.priority === "low" && "bg-success",
											)}
										/>
									</div>

									{task.description && (
										<p className="text-xs text-muted-foreground line-clamp-2">
											{task.description}
										</p>
									)}
								</div>
							</Card>
						</button>
					))
				)}
			</div>
		</div>
	);
};
