import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal, Move, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task, TaskColumn } from "@/types/tasks";
import { getPriorityColor } from "@/utils/taskUtils";

interface TaskCardProps {
	task: Task;
	columns: TaskColumn[];
	onTaskClick: (task: Task) => void;
	onDeleteTask: (taskId: string) => void;
	onMoveTask: (taskId: string, columnId: string) => void;
}

export const TaskCard = ({
	task,
	columns,
	onTaskClick,
	onDeleteTask,
	onMoveTask,
}: TaskCardProps) => {
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
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="p-1 rounded-sm hover:bg-muted transition-colors"
								onClick={(e) => e.stopPropagation()}
							>
								<MoreHorizontal className="h-4 w-4" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-48"
							onClick={(e) => e.stopPropagation()}
						>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
									<Move className="mr-2 h-4 w-4" />
									Mover para
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent>
									{columns
										.filter((column) => column.id !== task.columnId)
										.map((column) => (
											<DropdownMenuItem
												key={column.id}
												onClick={(e) => {
													e.stopPropagation();
													onMoveTask(task.id, column.id);
												}}
											>
												{column.title}
											</DropdownMenuItem>
										))}
								</DropdownMenuSubContent>
							</DropdownMenuSub>
							<DropdownMenuItem
								variant="destructive"
								onClick={(e) => {
									e.stopPropagation();
									onDeleteTask(task.id);
								}}
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Excluir
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
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
