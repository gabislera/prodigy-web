"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { useCalendarDnd } from ".";

interface DroppableCellProps {
	id: string;
	date: Date;
	time?: number; // For week/day views, represents hours (e.g., 9.25 for 9:15)
	children?: React.ReactNode;
	className?: string;
	onClick?: () => void;
	onExternalDrop?: (date: Date, time?: number) => void;
}

export function DroppableCell({
	id,
	date,
	time,
	children,
	className,
	onClick,
	onExternalDrop,
}: DroppableCellProps) {
	const { activeEvent } = useCalendarDnd();

	const { setNodeRef, isOver } = useDroppable({
		id,
		data: {
			date,
			time,
		},
	});

	// Handle native HTML5 drag & drop from sidebar
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		const taskId = sessionStorage.getItem("draggingTaskId");
		if (taskId && onExternalDrop) {
			onExternalDrop(date, time);
			sessionStorage.removeItem("draggingTaskId");
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onClick?.();
		}
	};

	// Format time for display in tooltip (only for debugging)
	const formattedTime =
		time !== undefined
			? `${Math.floor(time)}:${Math.round((time - Math.floor(time)) * 60)
					.toString()
					.padStart(2, "0")}`
			: null;

	return (
		<button
			ref={setNodeRef}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			type="button"
			className={cn(
				"flex flex-1 h-full min-h-0 flex-col overflow-hidden px-0.5 py-1 data-dragging:bg-accent sm:px-1",
				className,
			)}
			title={formattedTime ? `${formattedTime}` : undefined}
			data-dragging={isOver && activeEvent ? true : undefined}
		>
			{children}
		</button>
	);
}
