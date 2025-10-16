import {
	closestCorners,
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task, TaskColumn } from "@/types/tasks";
import { getPriorityColor } from "@/utils/taskUtils";
import { DroppableColumn } from "./droppable-column";
import { TaskCard } from "./task-card";

interface KanbanBoardProps {
	columns: TaskColumn[];
	onTaskClick: (task: Task) => void;
	onDeleteTask: (taskId: string) => void;
	onMoveTask: (taskId: string, columnId: string) => void;
	onToggleComplete: (taskId: string, completed: boolean) => void;
	onDragStart: (event: DragStartEvent) => void;
	onDragOver: (event: DragOverEvent) => void;
	onDragEnd: (event: DragEndEvent) => void;
	activeId: string | null;
}

export const KanbanBoard = ({
	columns,
	onTaskClick,
	onDeleteTask,
	onMoveTask,
	onToggleComplete,
	onDragStart,
	onDragOver,
	onDragEnd,
	activeId,
}: KanbanBoardProps) => {
	const activeTask = activeId
		? columns.flatMap((col) => col.tasks).find((task) => task.id === activeId)
		: null;

	return (
		<DndContext
			sensors={useSensors(
				useSensor(PointerSensor, {
					activationConstraint: {
						distance: 8,
					},
				}),
			)}
			collisionDetection={closestCorners}
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
		>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{columns.map((column) => {
					const columnTasks = column.tasks;
					return (
						<DroppableColumn key={column.id} column={column}>
							<SortableContext
								items={columnTasks.map((task) => task.id)}
								strategy={verticalListSortingStrategy}
							>
								{columnTasks.map((task) => (
									<TaskCard
										key={task.id}
										task={task}
										columns={columns}
										onTaskClick={onTaskClick}
										onDeleteTask={onDeleteTask}
										onMoveTask={onMoveTask}
										onToggleComplete={onToggleComplete}
									/>
								))}
							</SortableContext>
						</DroppableColumn>
					);
				})}
			</div>
			<DragOverlay>
				{activeTask ? (
					<Card className="p-2 bg-gradient-card border-border/50 cursor-grabbing shadow-xl rotate-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 flex-1 pr-2">
								<Checkbox
									checked={activeTask.completed}
									className="opacity-100 transition-opacity rounded-full border-2"
								/>
								<h4
									className={`font-medium text-sm transition-all ${
										activeTask.completed
											? "line-through text-muted-foreground opacity-70"
											: ""
									}`}
								>
									{activeTask.title}
								</h4>
							</div>
							<Badge
								variant="outline"
								className={`text-xs px-2 py-0 w-12 text-center`}
								style={getPriorityColor(activeTask.priority)}
							>
								{activeTask.priority === "high"
									? "Alta"
									: activeTask.priority === "medium"
										? "Média"
										: "Baixa"}
							</Badge>
						</div>
					</Card>
				) : null}
			</DragOverlay>
		</DndContext>
	);
};
