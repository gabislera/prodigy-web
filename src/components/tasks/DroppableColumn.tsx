import { useDroppable } from "@dnd-kit/core";
import type { TaskColumn } from "@/types/tasks";

interface DroppableColumnProps {
	column: TaskColumn;
	children: React.ReactNode;
}

export const DroppableColumn = ({ column, children }: DroppableColumnProps) => {
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
			</div>

			<div className="space-y-2 min-h-[60px] p-2 rounded-lg bg-muted/5 border-2 border-dashed border-transparent hover:border-border/50 transition-colors">
				{children}
			</div>
		</div>
	);
};
