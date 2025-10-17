import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useTodayTasks } from "@/hooks/use-today-tasks";
import type { Task } from "@/types/tasks";
import { getPriorityColor } from "@/utils/taskUtils";

interface TodayTasksListProps {
	onTaskClick?: (task: Task) => void;
	maxItems?: number;
}

export function TodayTasksList({
	onTaskClick,
	maxItems = 5,
}: TodayTasksListProps) {
	const { data: todayTasks, isLoading } = useTodayTasks();

	const getTaskTimeString = (task: Task) => {
		if (!task.startDate || !task.endDate) return null;

		const startDate = new Date(task.startDate);
		const endDate = new Date(task.endDate);

		const startTime = startDate.toLocaleTimeString("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
		});
		const endTime = endDate.toLocaleTimeString("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
		});

		return `${startTime} - ${endTime}`;
	};

	const incompleteTasks = todayTasks?.filter((task) => !task.completed) || [];

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
		<div className="space-y-2">
			{isLoading && (
				<div className="text-center py-4">
					<p className="text-xs text-muted-foreground">Loading tasks...</p>
				</div>
			)}

			{!isLoading && !hasTasks && (
				<div className="text-center py-4">
					<p className="text-xs text-muted-foreground">No tasks for today</p>
				</div>
			)}

			{!isLoading &&
				hasTasks &&
				sortedTasks.map((task) => {
					const timeString = getTaskTimeString(task);

					return (
						<Card
							key={task.id}
							className="p-3 bg-gradient-card border-border/50 cursor-pointer hover:shadow-card transition-all group !gap-1"
							onClick={() => onTaskClick?.(task)}
						>
							<div className="flex items-center justify-between">
								<div className="flex flex-col items-start gap-2">
									<h4 className="font-medium text-sm transition-all">
										{task.title}
									</h4>

									{timeString && (
										<div className="flex items-center gap-1 text-xs text-muted-foreground">
											<Clock className="h-3 w-3" />
											<span>{timeString}</span>
										</div>
									)}
								</div>

								<Badge
									variant="outline"
									className={`text-xs px-2 py-0 w-12 text-center`}
									style={getPriorityColor(task.priority)}
								>
									{task.priority === "high"
										? "Alta"
										: task.priority === "medium"
											? "Média"
											: "Baixa"}
								</Badge>
							</div>
						</Card>
					);
				})}
		</div>
	);
}
