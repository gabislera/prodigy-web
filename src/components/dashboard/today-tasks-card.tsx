import { Logs } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task, TaskGroup } from "@/types/tasks";
import { formatTaskTimeRange } from "@/utils/date-helpers";
import { filterTodayTasks } from "@/utils/taskFilters";

interface TodayTasksCardProps {
	taskGroups: TaskGroup[];
	isLoading: boolean;
	onTaskClick: (task: Task) => void;
	maxItems?: number;
}

export function TodayTasksCard({
	taskGroups,
	isLoading,
	onTaskClick,
	maxItems = 5,
}: TodayTasksCardProps) {
	const allTasks: Task[] = taskGroups.flatMap((group) =>
		group.columns.flatMap((column) => column.tasks),
	);

	const todayTasks = filterTodayTasks(allTasks);

	const incompleteTasks = todayTasks.filter((task) => !task.completed);

	const priorityOrder = { high: 3, medium: 2, low: 1 };

	const sortedTasks = incompleteTasks
		.sort((a, b) => {
			const aPriority = priorityOrder[a.priority] || 0;
			const bPriority = priorityOrder[b.priority] || 0;

			if (aPriority !== bPriority) return bPriority - aPriority;

			const aStart = a.startDate ? new Date(a.startDate).getTime() : 0;
			const bStart = b.startDate ? new Date(b.startDate).getTime() : 0;

			return aStart - bStart;
		})
		.slice(0, maxItems);

	const hasTasks = !isLoading && incompleteTasks.length > 0;

	return (
		<Card className="bg-card border-border">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Logs className="text-secondary/80" size={24} />
					Tarefas de Hoje
				</CardTitle>
				<p className="text-sm text-muted-foreground">
					Suas prioridades para hoje
				</p>
			</CardHeader>
			<CardContent className="space-y-3">
				{isLoading && (
					<div className="text-center py-4">
						<p className="text-xs text-muted-foreground">
							Carregando tarefas...
						</p>
					</div>
				)}

				{!isLoading && !hasTasks && (
					<div className="text-center py-4">
						<p className="text-xs text-muted-foreground">
							Nenhuma tarefa para hoje
						</p>
					</div>
				)}

				{!isLoading &&
					hasTasks &&
					sortedTasks.map((task) => {
						const timeString =
							task.startDate && task.endDate
								? formatTaskTimeRange(task.startDate, task.endDate)
								: null;

						return (
							<button
								key={task.id}
								type="button"
								className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors text-left"
								onClick={() => onTaskClick(task)}
							>
								<div className="flex flex-col gap-1 flex-1">
									<h4 className="font-medium text-sm">{task.title}</h4>
									{timeString && (
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<span>{timeString}</span>
										</div>
									)}
								</div>
								<div className="px-3 py-1 rounded-full bg-success/20 text-success text-xs font-medium">
									{task.priority === "high"
										? "Alta"
										: task.priority === "medium"
											? "Média"
											: "Baixa"}
								</div>
							</button>
						);
					})}
			</CardContent>
		</Card>
	);
}
