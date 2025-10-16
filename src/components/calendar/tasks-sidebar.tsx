import { GripVertical } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { ApiTaskGroup } from "@/types/tasks";

interface TasksSidebarProps {
	taskGroupsWithDetails: ApiTaskGroup[];
}

export const TasksSidebar = ({ taskGroupsWithDetails }: TasksSidebarProps) => {
	const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

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

	const tasksToShow = useMemo(() => {
		if (selectedGroupIds.length === 0) return allTasks;
		return allTasks.filter((task) => selectedGroupIds.includes(task.groupId));
	}, [allTasks, selectedGroupIds]);

	const toggleGroupSelection = (groupId: string) => {
		setSelectedGroupIds((prev) =>
			prev.includes(groupId)
				? prev.filter((id) => id !== groupId)
				: [...prev, groupId],
		);
	};

	return (
		<div className="h-full bg-card rounded-lg border border-border p-4 overflow-y-auto flex flex-col gap-4">
			<div>
				<h2 className="text-lg font-semibold mb-2">Tarefas</h2>
				<p className="text-xs text-muted-foreground">
					Arraste as tarefas para o calendário
				</p>
			</div>

			<div className="flex gap-2 flex-wrap">
				{taskGroupsWithDetails
					.filter((group) => group.name?.toLowerCase() !== "calendar")
					.map((group) => {
						const isSelected = selectedGroupIds.includes(group.id);
						const hasSelection = selectedGroupIds.length > 0;

						return (
							<Badge
								key={group.id}
								onClick={() => toggleGroupSelection(group.id)}
								className={`text-xs border transition-all cursor-pointer ${
									group.bgColor.startsWith("bg-")
										? `${group.bgColor} ${group.color}`
										: ""
								} ${!hasSelection ? "opacity-40" : hasSelection && !isSelected ? "opacity-40" : "opacity-100"} ${
									isSelected ? "ring-2 ring-primary/50 scale-105" : ""
								}`}
								style={
									group.bgColor.startsWith("#")
										? {
												backgroundColor: group.bgColor,
												color: group.color?.startsWith("#")
													? group.color
													: undefined,
												borderColor: group.color?.startsWith("#")
													? `${group.color}4D` // ~30% alpha for border
													: group.color,
											}
										: undefined
								}
							>
								{group.name}
							</Badge>
						);
					})}
			</div>

			<div className="flex-1 overflow-y-auto space-y-2">
				{tasksToShow.length === 0 ? (
					<p className="text-sm text-muted-foreground text-center py-8">
						Nenhuma tarefa encontrada
					</p>
				) : (
					tasksToShow.map((task) => (
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
