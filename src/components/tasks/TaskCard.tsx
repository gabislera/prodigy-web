import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal, Move, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
	onToggleComplete: (taskId: string, completed: boolean) => void;
}

export const TaskCard = ({
	task,
	columns,
	onTaskClick,
	onDeleteTask,
	onMoveTask,
	onToggleComplete,
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

	const handleToggleComplete = (e: React.MouseEvent) => {
		e.stopPropagation();
		onToggleComplete(task.id, !task.completed);
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<Card
				className="p-2 mb-2 bg-gradient-card border border-border/50 cursor-grab active:cursor-grabbing hover:shadow-card transition-all group"
				onClick={() => {
					if (!isDragging) {
						onTaskClick(task);
					}
				}}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 flex-1 pr-2">
						<Checkbox
							checked={task.completed}
							onClick={handleToggleComplete}
							className="opacity-100 transition-opacity rounded-full border-2"
						/>
						<h4
							className={`font-medium text-sm transition-all ${
								task.completed
									? "line-through text-muted-foreground opacity-70"
									: ""
							}`}
						>
							{task.title}
						</h4>
					</div>
					<div className="flex items-center gap-2">
						<Badge
							variant="outline"
							className={`text-xs px-2 py-0 w-12 text-center ${getPriorityColor(task.priority)}`}
						>
							{task.priority === "high"
								? "Alta"
								: task.priority === "medium"
									? "Média"
									: "Baixa"}
						</Badge>
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
				</div>
			</Card>
		</div>
	);
};
