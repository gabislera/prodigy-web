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
import type { Task, TaskColumn } from "@/types/tasks";
import { getPriorityColor } from "@/utils/taskUtils";
import { DroppableColumn } from "./DroppableColumn";
import { TaskCard } from "./TaskCard";

interface KanbanBoardProps {
	columns: TaskColumn[];
	onTaskClick: (task: Task) => void;
	onDeleteTask: (taskId: string) => void;
	onMoveTask: (taskId: string, columnId: string) => void;
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
									/>
								))}
							</SortableContext>
						</DroppableColumn>
					);
				})}
			</div>
			<DragOverlay>
				{activeTask ? (
					<Card className="p-3 bg-gradient-card border-border/50 cursor-grabbing shadow-xl rotate-3">
						<div className="flex items-start justify-between mb-2">
							<h4 className="font-medium text-sm">{activeTask.title}</h4>
						</div>
						<p className="text-xs text-muted-foreground mb-3 line-clamp-2">
							{activeTask.description}
						</p>
						<Badge
							variant="outline"
							className={`text-xs px-2 py-0 ${getPriorityColor(activeTask.priority)}`}
						>
							{activeTask.priority === "high"
								? "Alta"
								: activeTask.priority === "medium"
									? "Média"
									: "Baixa"}
						</Badge>
					</Card>
				) : null}
			</DragOverlay>
		</DndContext>
	);
};
