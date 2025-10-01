import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TaskColumn } from "@/types/tasks";

interface DroppableColumnProps {
	column: TaskColumn;
	children: React.ReactNode;
	onCreateTask?: () => void;
}

export const DroppableColumn = ({
	column,
	children,
	onCreateTask,
}: DroppableColumnProps) => {
	const { setNodeRef } = useDroppable({
		id: column.id,
	});

	return (
		<div ref={setNodeRef} className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{/* <column.icon className={`h-4 w-4 ${column.color}`} /> */}
					<h3 className="font-semibold text-sm">{column.title}</h3>
				</div>
				{column.id === "todo" && onCreateTask && (
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6"
						onClick={onCreateTask}
					>
						<Plus className="h-3 w-3" />
					</Button>
				)}
			</div>

			<div className="space-y-2 min-h-[200px] p-2 rounded-lg bg-muted/5 border-2 border-dashed border-transparent hover:border-border/50 transition-colors">
				{children}
			</div>
		</div>
	);
};
