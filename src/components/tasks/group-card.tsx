import { Folder, MoreHorizontal, Trash2 } from "lucide-react";
import React from "react";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TaskGroup } from "@/types/tasks";
import { iconOptions } from "@/utils/taskUtils";

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
	return (
		<Card
			className={`p-4 ${group.bgColor} border-border/50 cursor-pointer hover:shadow-card transition-all group`}
			onClick={() => onGroupClick(group.id)}
		>
			<div className="flex items-center gap-3">
				<div className={`p-2 rounded-lg `}>
					{React.createElement(
						iconOptions.find((option) => option.value === group.icon)?.icon ||
							Folder,
						{
							className: `h-5 w-5 ${group.color}`,
						},
					)}
				</div>
				<div className="flex-1">
					<h3 className="font-semibold text-sm">{group.name}</h3>
					{/* <p className="text-xs text-muted-foreground">
						{group.completedCount} de {group.taskCount} concluídas
					</p> */}
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="p-1 rounded-sm hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
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
							Editar
						</DropdownMenuItem>
						<DropdownMenuItem
							variant="destructive"
							onClick={(e) => {
								e.stopPropagation();
								onDeleteGroup(group.id);
							}}
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Excluir
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* <div className="w-full bg-background/30 rounded-full h-2 mb-2">
				<div
					className={`h-2 rounded-full ${getProgressBarColor(group.color)}`}
					style={{
						width: `${(group.completedCount / group.taskCount) * 100}%`,
					}}
				/>
			</div> */}

			{/* <div className="flex items-center justify-between text-xs">
				<span className="text-muted-foreground">Progresso</span>
				<span className="font-medium">
					{Math.round((group.completedCount / group.taskCount) * 100)}%
				</span>
			</div> */}
		</Card>
	);
};
