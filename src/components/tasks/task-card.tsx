import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

export const TaskCard = ({ task, onTaskClick }: TaskCardProps) => {
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
				className="p-4 hover:shadow-lg transition-all cursor-pointer bg-card group"
				onClick={() => {
					if (!isDragging) {
						onTaskClick(task);
					}
				}}
			>
				<div className="space-y-3">
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium mb-1">{task.title}</p>
							{task.description && (
								<p className="text-xs text-muted-foreground line-clamp-2 mb-3">
									{task.description}
								</p>
							)}
						</div>
					</div>

					<div className="flex items-center justify-between gap-2">
						<div
							className={cn(
								"px-2 py-1 rounded text-xs font-medium",
								task.priority === "high" &&
									"bg-destructive/20 text-destructive",
								task.priority === "medium" && "bg-warning/20 text-warning",
								task.priority === "low" && "bg-success/20 text-success",
							)}
						>
							{task.priority === "high"
								? "Alta"
								: task.priority === "medium"
									? "Média"
									: "Baixa"}
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};
