import type {
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { toast } from "sonner";
import type { TaskColumn } from "@/types/tasks";
import { useTasks } from "./use-tasks";

interface UseDragAndDropProps {
	taskColumns: TaskColumn[];
	onOptimisticUpdate: (newColumns: TaskColumn[]) => void;
	onResetOptimistic: () => void;
}

export function useDragAndDrop({
	taskColumns,
	onOptimisticUpdate,
	onResetOptimistic,
}: UseDragAndDropProps) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const { updateTask } = useTasks();

	// Helper function to calculate new positions when reordering within the same column
	const calculateNewPositions = (
		columns: typeof taskColumns,
		activeId: string,
		overId: string,
		targetColumnId: string,
	) => {
		const targetColumn = columns.find((col) => col.id === targetColumnId);
		if (!targetColumn) return [];

		const columnTasks = targetColumn.tasks;
		const activeTaskIndex = columnTasks.findIndex(
			(task) => task.id === activeId,
		);
		const overTaskIndex = columnTasks.findIndex((task) => task.id === overId);

		if (activeTaskIndex === -1 || overTaskIndex === -1) return [];

		const newTasks = [...columnTasks];
		const [movedTask] = newTasks.splice(activeTaskIndex, 1);

		// Insert at the new position
		if (activeTaskIndex < overTaskIndex) {
			newTasks.splice(overTaskIndex - 1, 0, movedTask);
		} else {
			newTasks.splice(overTaskIndex, 0, movedTask);
		}

		// Return updates for all affected tasks
		return newTasks.map((task, index) => ({
			taskId: task.id,
			position: index,
		}));
	};

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;

		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		// Find the active task
		const activeTask = taskColumns
			.flatMap((col) => col.tasks)
			.find((task) => task.id === activeId);

		if (!activeTask) return;

		// If dropping on a column or another task
		if (overId !== activeId) {
			// Check if dropping on a different column
			const activeColumn = taskColumns.find((column) =>
				column.tasks?.some((task) => task.id === activeId),
			);

			// Determine target column
			let targetColumn = overId;

			// If dropping on a task, get its column
			const overTask = taskColumns
				.flatMap((col) => col.tasks || [])
				.find((task) => task.id === overId);

			if (overTask) {
				targetColumn =
					taskColumns.find((column) =>
						column.tasks?.some((task) => task.id === overId),
					)?.id || overId;
			}

			if (activeColumn?.id !== targetColumn) {
				// Task is being moved to a different column
				// We'll handle this in handleDragEnd
			}
		}
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);

		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		// Find the active task
		const activeTask = taskColumns
			.flatMap((col) => col.tasks)
			.find((task) => task.id === activeId);

		if (!activeTask) return;

		// Find current column of the task
		const currentColumn = taskColumns.find((column) =>
			column.tasks?.some((task) => task.id === activeId),
		);

		// Determine target column and position
		let targetColumn = overId;
		let targetPosition = 0;

		// If dropping on a task, get its column and calculate position
		const overTask = taskColumns
			.flatMap((col) => col.tasks)
			.find((task) => task.id === overId);

		if (overTask) {
			// Dropping on another task
			const overColumn = taskColumns.find((column) =>
				column.tasks.some((task) => task.id === overId),
			);
			targetColumn = overColumn?.id || overId;

			// Get all tasks in the target column
			const targetColumnTasks = overColumn?.tasks || [];
			const overTaskIndex = targetColumnTasks.findIndex(
				(task) => task.id === overId,
			);

			if (overTaskIndex !== -1) {
				// Position after the task we're dropping on
				targetPosition = overTaskIndex + 1;
			}
		} else {
			// Dropping on a column
			targetColumn = overId;
			// Position at the end of the column
			const targetColumnData = taskColumns.find((col) => col.id === overId);
			targetPosition = (targetColumnData?.tasks || []).length;
		}

		// Only update if there's a change
		if (
			currentColumn?.id !== targetColumn ||
			targetPosition !== activeTask.position
		) {
			// Create optimistic update
			const newColumns = [...taskColumns];

			// Remove task from current column
			const currentColIndex = newColumns.findIndex(
				(col) => col.id === currentColumn?.id,
			);
			if (currentColIndex !== -1) {
				newColumns[currentColIndex] = {
					...newColumns[currentColIndex],
					tasks: newColumns[currentColIndex].tasks.filter(
						(task) => task.id !== activeId,
					),
				};
			}

			// Add task to target column
			const targetColIndex = newColumns.findIndex(
				(col) => col.id === targetColumn,
			);
			if (targetColIndex !== -1) {
				const updatedTask = {
					...activeTask,
					columnId: targetColumn,
					position: targetPosition,
				};
				const targetTasks = [...newColumns[targetColIndex].tasks];

				if (overTask) {
					// Insert at specific position
					const overTaskIndex = targetTasks.findIndex(
						(task) => task.id === overId,
					);
					if (overTaskIndex !== -1) {
						targetTasks.splice(overTaskIndex + 1, 0, updatedTask);
					} else {
						targetTasks.push(updatedTask);
					}
				} else {
					// Add to end
					targetTasks.push(updatedTask);
				}

				// Update positions for all tasks in target column
				const tasksWithUpdatedPositions = targetTasks.map((task, index) => ({
					...task,
					position: index,
				}));

				newColumns[targetColIndex] = {
					...newColumns[targetColIndex],
					tasks: tasksWithUpdatedPositions,
				};
			}

			// Apply optimistic update immediately
			onOptimisticUpdate(newColumns);

			try {
				// If moving within the same column, update all affected tasks
				if (currentColumn?.id === targetColumn && overTask) {
					const positionUpdates = calculateNewPositions(
						taskColumns,
						activeId,
						overId,
						targetColumn,
					);

					// Update all affected tasks - preserve type
					await Promise.all(
						positionUpdates.map(({ taskId, position }) => {
							const task = taskColumns
								.flatMap((col) => col.tasks)
								.find((t) => t.id === taskId);

							return updateTask({
								taskId,
								data: {
									position,
									...(task?.type && { type: task.type }),
								},
							});
						}),
					);
				} else {
					// Moving to a different column or to empty space - preserve type
					await updateTask({
						taskId: activeId,
						data: {
							columnId: targetColumn,
							position: targetPosition,
							...(activeTask?.type && { type: activeTask.type }),
						},
					});
				}

				// Reset optimistic state after successful API call and invalidation
				onResetOptimistic();
			} catch (error) {
				console.error("Erro ao mover task:", error);
				// Reset optimistic state on error
				onResetOptimistic();
				toast.error("Erro ao mover tarefa. Tente novamente.");
			}
		}
	};

	return {
		activeId,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	};
}
