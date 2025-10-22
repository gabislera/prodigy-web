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
import type { Task, TaskColumn } from "@/types/tasks";
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
	onEditColumn: (column: TaskColumn) => void;
	onDeleteColumn: (columnId: string) => void;
	onQuickCreateTask: (columnId: string) => void;
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
	onEditColumn,
	onDeleteColumn,
	onQuickCreateTask,
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
			<div className="h-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent">
				<div className="flex gap-4 h-full pb-4 items-start">
					{columns.map((column) => {
						const columnTasks = column.tasks;
						return (
							<div key={column.id} className="flex-shrink-0">
								<DroppableColumn
									column={column}
									onEditColumn={onEditColumn}
									onDeleteColumn={onDeleteColumn}
									onQuickCreateTask={onQuickCreateTask}
								>
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
							</div>
						);
					})}
				</div>
			</div>
			<DragOverlay>
				{activeTask ? (
					<TaskCard
						key={activeTask.id}
						task={activeTask}
						onTaskClick={onTaskClick}
						onDeleteTask={onDeleteTask}
						onMoveTask={onMoveTask}
						onToggleComplete={onToggleComplete}
						columns={[]}
					/>
				) : null}
			</DragOverlay>
		</DndContext>
	);
};
