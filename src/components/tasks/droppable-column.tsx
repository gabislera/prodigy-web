import { useDroppable } from "@dnd-kit/core";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { TaskColumn } from "@/types/tasks";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DroppableColumnProps {
	column: TaskColumn;
	children: React.ReactNode;
	onEditColumn: (column: TaskColumn) => void;
	onDeleteColumn: (columnId: string) => void;
	onQuickCreateTask: (columnId: string) => void;
}

export const DroppableColumn = ({
	column,
	children,
	onEditColumn,
	onDeleteColumn,
	onQuickCreateTask,
}: DroppableColumnProps) => {
	const { setNodeRef } = useDroppable({
		id: column.id,
	});
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	return (
		<>
			<div
				ref={setNodeRef}
				className="flex flex-col w-80 h-full max-h-[calc(100vh-200px)]"
			>
				<div className="flex items-center justify-between flex-shrink-0 mb-3">
					<div className="flex items-center gap-2">
						<h3 className="font-semibold text-sm">{column.title}</h3>
						<Badge variant="outline">{column.tasks.length}</Badge>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<MoreVertical size={16} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => onEditColumn(column)}>
								<Pencil size={16} className="mr-2" />
								Editar
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setShowDeleteDialog(true)}
								className="text-destructive"
							>
								<Trash2 size={16} className="mr-2" />
								Excluir
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex-1 space-y-2 min-h-[60px] rounded-lg bg-muted/5 border-2 border-dashed border-transparent transition-colors scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent overflow-y-auto overflow-x-hidden mb-3">
					{children}
				</div>
				<Button
					variant="ghost"
					className="w-full justify-start text-muted-foreground hover:text-foreground flex-shrink-0"
					size="sm"
					onClick={() => onQuickCreateTask(column.id)}
				>
					<Plus size={16} className="mr-2" />
					Adicionar tarefa
				</Button>
			</div>

			<ConfirmDialog
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				title="Excluir coluna"
				description={
					<>
						Tem certeza que deseja excluir a coluna "{column.title}"?{" "}
						<strong>
							Todas as tarefas desta coluna também serão removidas.
						</strong>{" "}
						Esta ação não pode ser desfeita.
					</>
				}
				confirmLabel="Excluir"
				onConfirm={() => onDeleteColumn(column.id)}
			/>
		</>
	);
};
