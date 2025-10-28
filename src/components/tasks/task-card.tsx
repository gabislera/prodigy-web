import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { memo } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Task, TaskColumn } from "@/types/tasks";

interface TaskCardProps {
	task: Task;
	columns: TaskColumn[];
	onTaskClick: (task: Task) => void;
	onDeleteTask: (taskId: string) => void;
	onMoveTask: (taskId: string, columnId: string) => void;
	onToggleComplete: (taskId: string, completed: boolean) => void;
}

export const TaskCard = memo(({ task, onTaskClick }: TaskCardProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: task.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<Card
				className="p-3 hover:shadow-lg transition-all cursor-pointer bg-card group"
				onClick={() => {
					if (!isDragging) {
						onTaskClick(task);
					}
				}}
			>
				<div className="space-y-1">
					<div className="flex items-start flex-col">
						<div className="flex items-center justify-between w-full">
							<p className="text-sm font-medium mb-1">{task.title}</p>
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
							<p className="text-xs text-muted-foreground line-clamp-2 mb-3">
								{task.description}
							</p>
						)}
					</div>

					{task.startDate && task.endDate && (
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<Calendar className="h-3 w-3 text-muted-foreground" size={16} />
								<p className="text-xs text-muted-foreground">
									{format(new Date(task.startDate), "dd/MM HH:mm")} -{" "}
									{format(new Date(task.endDate), "HH:mm")}
								</p>
							</div>
						</div>
					)}
				</div>
			</Card>
		</div>
	);
});

TaskCard.displayName = "TaskCard";
