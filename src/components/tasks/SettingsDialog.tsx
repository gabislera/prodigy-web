import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { TaskColumn } from "@/types/tasks";

interface SettingsDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	columns: TaskColumn[];
	onSaveColumnOrder: (newOrder: TaskColumn[]) => void;
}

interface SortableColumnItemProps {
	column: TaskColumn;
}

function SortableColumnItem({ column }: SortableColumnItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: column.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center gap-3 p-3 bg-card border rounded-lg ${
				isDragging ? "opacity-50" : ""
			}`}
		>
			<div
				{...attributes}
				{...listeners}
				className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
			>
				<GripVertical className="h-4 w-4" />
			</div>
			<span className="font-medium">{column.title}</span>
		</div>
	);
}

export function SettingsDialog({
	isOpen,
	onOpenChange,
	columns,
	onSaveColumnOrder,
}: SettingsDialogProps) {
	const [localColumns, setLocalColumns] = useState<TaskColumn[]>(columns);

	// Update local columns when props change
	useEffect(() => {
		setLocalColumns(columns);
	}, [columns]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = localColumns.findIndex((col) => col.id === active.id);
			const newIndex = localColumns.findIndex((col) => col.id === over.id);

			setLocalColumns((items) => arrayMove(items, oldIndex, newIndex));
		}
	};

	const handleSave = () => {
		onSaveColumnOrder(localColumns);
		onOpenChange(false);
	};

	const handleCancel = () => {
		setLocalColumns(columns);
		onOpenChange(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Configurações</DialogTitle>
					<DialogDescription>
						Reordene as colunas do kanban arrastando-as.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-2">
						<h4 className="text-sm font-medium">Ordem das Colunas</h4>
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={localColumns.map((col) => col.id)}
								strategy={verticalListSortingStrategy}
							>
								<div className="space-y-2">
									{localColumns.map((column) => (
										<SortableColumnItem key={column.id} column={column} />
									))}
								</div>
							</SortableContext>
						</DndContext>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleCancel}>
						Cancelar
					</Button>
					<Button onClick={handleSave}>Salvar</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
