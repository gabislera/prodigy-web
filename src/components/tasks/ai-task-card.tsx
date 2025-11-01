import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { formatDate, formatTimeSimple } from "@/utils/date-helpers";

interface AITaskCardProps {
	task: {
		title: string;
		description?: string;
		priority: "low" | "medium" | "high";
		startDate: string;
		endDate: string;
		selected?: boolean;
	};
	onToggle: () => void;
}

export function AITaskCard({ task, onToggle }: AITaskCardProps) {
	const startDate = new Date(task.startDate);
	const endDate = new Date(task.endDate);

	return (
		<Card
			className="p-4 cursor-pointer transition-all border-border hover:border-primary/30"
			onClick={onToggle}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-4">
						<h4 className="font-medium">{task.title}</h4>
						<span
							className={cn(
								"rounded-full w-2 h-2",
								task.priority === "high" && "bg-red-500",
								task.priority === "medium" && "bg-yellow-500",
								task.priority === "low" && "bg-green-500",
							)}
						/>
					</div>
					<div className="flex flex-col gap-2 mt-2">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-1 text-xs text-muted-foreground">
								<Calendar size={12} />
								<span>{formatDate(startDate, "dd/MM/yyyy")}</span>
							</div>
							<div className="flex items-center gap-1 text-xs text-muted-foreground">
								<span>
									{formatTimeSimple(startDate)} - {formatTimeSimple(endDate)}
								</span>
							</div>
						</div>
					</div>
				</div>
				<Checkbox
					checked={task.selected}
					onCheckedChange={onToggle}
					onClick={(e) => e.stopPropagation()}
				/>
			</div>
		</Card>
	);
}
