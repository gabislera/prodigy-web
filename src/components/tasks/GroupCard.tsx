import { Card } from "@/components/ui/card";
import type { TaskGroup } from "@/types/tasks";
import { getProgressBarColor } from "@/utils/taskUtils";

interface GroupCardProps {
	group: TaskGroup;
	onGroupClick: (groupId: string) => void;
}

export const GroupCard = ({ group, onGroupClick }: GroupCardProps) => {
	// console.log(group);
	return (
		<Card
			className={`p-4 ${group.bgColor} border-border/50 cursor-pointer hover:shadow-card transition-all`}
			onClick={() => onGroupClick(group.id)}
		>
			<div className="flex items-center gap-3 mb-3">
				<div className={`p-2 rounded-lg bg-background/50`}>
					{/* <group.icon className={`h-5 w-5 ${group.color}`} /> */}
				</div>
				<div className="flex-1">
					<h3 className="font-semibold text-sm">{group.name}</h3>
					<p className="text-xs text-muted-foreground">
						{group.completedCount} de {group.taskCount} concluídas
					</p>
				</div>
			</div>

			<div className="w-full bg-background/30 rounded-full h-2 mb-2">
				<div
					className={`h-2 rounded-full ${getProgressBarColor(group.color)}`}
					// style={{
					// 	width: `${(group.completedCount / group.taskCount) * 100}%`,
					// }}
				/>
			</div>

			<div className="flex items-center justify-between text-xs">
				<span className="text-muted-foreground">Progresso</span>
				{/* <span className="font-medium">
					{Math.round((group.completedCount / group.taskCount) * 100)}%
				</span> */}
			</div>
		</Card>
	);
};
