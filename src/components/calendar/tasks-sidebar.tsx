import { Filter, GripVertical } from "lucide-react";
import { useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ApiTaskGroup } from "@/types/tasks";

interface TasksSidebarProps {
	taskGroupsWithDetails: ApiTaskGroup[];
	selectedGroupIds: string[];
	scheduleFilter: "all" | "scheduled" | "unscheduled";
	completionFilter: "all" | "completed" | "incomplete";
	dateRange: DateRange | undefined;
	onFiltersToggle: () => void;
}

export const TasksSidebar = ({
	taskGroupsWithDetails,
	selectedGroupIds,
	scheduleFilter,
	completionFilter,
	dateRange,
	onFiltersToggle,
}: TasksSidebarProps) => {
	const allTasks = useMemo(() => {
		return taskGroupsWithDetails.flatMap((group) =>
			group.columns.flatMap((column) =>
				column.tasks.map((task) => ({
					...task,
					groupId: group.id,
					groupName: group.name,
					groupColor: group.color,
					groupBgColor: group.bgColor,
				})),
			),
		);
	}, [taskGroupsWithDetails]);

	const filteredTasks = useMemo(() => {
		let filtered = allTasks;

		// Filter by group
		if (selectedGroupIds.length > 0) {
			if (selectedGroupIds.includes("no-group")) {
				filtered = filtered.filter(
					(task) => !task.groupId || selectedGroupIds.includes(task.groupId),
				);
			} else {
				filtered = filtered.filter((task) =>
					selectedGroupIds.includes(task.groupId),
				);
			}
		}

		// Filter by schedule
		if (scheduleFilter === "scheduled") {
			filtered = filtered.filter((task) => task.startDate);
		} else if (scheduleFilter === "unscheduled") {
			filtered = filtered.filter((task) => !task.startDate);
		}

		// Filter by completion
		if (completionFilter === "completed") {
			filtered = filtered.filter((task) => task.completed);
		} else if (completionFilter === "incomplete") {
			filtered = filtered.filter((task) => !task.completed);
		}

		// Filter by date range
		if (dateRange?.from) {
			const rangeStart = new Date(
				dateRange.from.getFullYear(),
				dateRange.from.getMonth(),
				dateRange.from.getDate(),
			);
			const rangeEnd = dateRange.to
				? new Date(
						dateRange.to.getFullYear(),
						dateRange.to.getMonth(),
						dateRange.to.getDate(),
					)
				: rangeStart;

			filtered = filtered.filter((task) => {
				if (!task.startDate) return false;
				const taskDate = new Date(task.startDate);
				const taskDay = new Date(
					taskDate.getFullYear(),
					taskDate.getMonth(),
					taskDate.getDate(),
				);

				return taskDay >= rangeStart && taskDay <= rangeEnd;
			});
		}

		return filtered;
	}, [allTasks, selectedGroupIds, scheduleFilter, completionFilter, dateRange]);
	return (
		<div className="h-full bg-card rounded-lg border border-border p-4 overflow-y-auto flex flex-col gap-4">
			<div>
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold mb-2">Tarefas</h2>
					<Button
						variant="outline"
						size="sm"
						onClick={onFiltersToggle}
						className="h-8 w-8 p-0"
					>
						<Filter className="h-4 w-4" />
					</Button>
				</div>
				<p className="text-xs text-muted-foreground">
					Arraste as tarefas para o calendário
				</p>
			</div>

			<div className="flex-1 overflow-y-auto space-y-2">
				{filteredTasks.length === 0 ? (
					<p className="text-sm text-muted-foreground text-center py-8">
						Nenhuma tarefa encontrada
					</p>
				) : (
					filteredTasks.map((task) => (
						<button
							key={task.id}
							type="button"
							draggable={!task.startDate}
							onDragStart={(e) => {
								sessionStorage.setItem("draggingTaskId", task.id);
								e.dataTransfer.effectAllowed = "move";
								e.currentTarget.classList.add("opacity-50");
							}}
							onDragEnd={(e) => e.currentTarget.classList.remove("opacity-50")}
							className={`w-full text-left p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors ${
								!task.startDate
									? "cursor-grab active:cursor-grabbing"
									: "cursor-pointer"
							}`}
						>
							<div className="flex items-start gap-2 mb-2">
								{!task.startDate && (
									<GripVertical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
								)}
								<div className="flex items-start justify-between gap-2 flex-1">
									<h3 className="font-medium text-sm flex-1 line-clamp-2">
										{task.title}
									</h3>
									<Badge
										className="text-xs shrink-0"
										style={{
											backgroundColor: task.groupBgColor,
											color: task.groupColor?.startsWith("#")
												? task.groupColor
												: undefined,
											borderColor: task.groupColor?.startsWith("#")
												? `${task.groupColor}4D`
												: task.groupColor,
										}}
									>
										{task.groupName}
									</Badge>
								</div>
							</div>

							{task.description && (
								<p className="text-xs text-muted-foreground line-clamp-2 mb-2 ml-6">
									{task.description}
								</p>
							)}
						</button>
					))
				)}
			</div>
		</div>
	);
};
