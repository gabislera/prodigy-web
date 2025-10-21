import {
	Folder,
	MoreHorizontal,
	Pencil,
	Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TaskGroup } from "@/types/tasks";
import { Progress } from "../ui/progress";

interface GroupCardProps {
	group: TaskGroup;
	onGroupClick: (groupId: string) => void;
	onEditGroup: (group: TaskGroup) => void;
	onDeleteGroup: (groupId: string) => void;
}

export const GroupCard = ({
	group,
	onGroupClick,
	onEditGroup,
	onDeleteGroup,
}: GroupCardProps) => {
	const progress =
		group.taskCount > 0
			? Math.round((group.completedCount / group.taskCount) * 100)
			: 0;
	const pending = group.taskCount - group.completedCount;

	return (
		<Card
			key={group.id}
			className="cursor-pointer hover:scale-[1.01] transition-all shadow-card bg-card border-border group"
			onClick={() => onGroupClick(group.id)}
		>
			<div className="p-6 space-y-4">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-4 flex-1">
						<Folder className="text-accent" />
						<div className="flex-1">
							<h3 className="font-semibold text-xl mb-1">{group.name}</h3>
							{group.description && (
								<p className="text-sm text-muted-foreground line-clamp-2">
									{group.description}
								</p>
							)}
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="p-1 rounded-sm "
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
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation();
									onEditGroup(group);
								}}
							>
								<Pencil className="h-4 w-4" />
								Editar
							</DropdownMenuItem>
							<DropdownMenuItem
								variant="destructive"
								onClick={(e) => {
									e.stopPropagation();
									onDeleteGroup(group.id);
								}}
							>
								<Trash2 className="h-4 w-4" />
								Excluir
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="space-y-3">
					<div className="flex justify-between items-center">
						<span className="text-sm text-muted-foreground">Progresso</span>
						<span className="font-semibold">
							{group.completedCount}/{group.taskCount} tarefas
						</span>
					</div>
					<Progress value={progress} className="h-2" />
					<div className="flex justify-between items-center">
						<span className="text-sm text-success font-medium">
							{progress}% completo
						</span>
						<span className="text-sm text-muted-foreground">
							{pending} pendentes
						</span>
					</div>
				</div>
			</div>
		</Card>
	);
};
