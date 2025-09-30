import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Task } from "@/types/tasks";
import { getPriorityColor } from "@/utils/taskUtils";

interface TaskCardProps {
	task: Task;
	onTaskClick: (task: Task) => void;
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
				className="p-3 mb-3 bg-gradient-card border-border/50 cursor-grab active:cursor-grabbing hover:shadow-card transition-all"
				onClick={() => {
					if (!isDragging) {
						onTaskClick(task);
					}
				}}
			>
				<div className="flex items-start justify-between mb-2">
					<h4 className="font-medium text-sm flex-1 pr-2">{task.title}</h4>
				</div>

				<p className="text-xs text-muted-foreground mb-3 line-clamp-2">
					{task.description}
				</p>

				<Badge
					variant="outline"
					className={`text-xs px-2 py-0 ${getPriorityColor(task.priority)}`}
				>
					{task.priority === "high"
						? "Alta"
						: task.priority === "medium"
							? "Média"
							: "Baixa"}
				</Badge>
			</Card>
		</div>
	);
};
