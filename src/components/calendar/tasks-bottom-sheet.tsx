import { ListTodo } from "lucide-react";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { TaskGroup } from "@/types/tasks";
import { removeHtmlTags } from "@/utils/taskUtils";

interface TaskWithGroup {
	id: string;
	title: string;
	description: string;
	priority: "high" | "medium" | "low";
	startDate?: string | null;
	completed: boolean;
	groupId: string | null;
	groupName: string;
	type?: "task" | "event";
}

interface TasksBottomSheetProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	allTasks: TaskWithGroup[];
	taskGroupsWithDetails: TaskGroup[];
	selectedGroupIds: string[];
	setSelectedGroupIds: (ids: string[]) => void;
	completionFilter: "all" | "completed" | "incomplete";
	setCompletionFilter: (filter: "all" | "completed" | "incomplete") => void;
	onTaskClick?: (task: TaskWithGroup) => void;
}

export const TasksBottomSheet = ({
	isOpen,
	onOpenChange,
	allTasks,
	taskGroupsWithDetails,
	selectedGroupIds,
	setSelectedGroupIds,
	completionFilter,
	setCompletionFilter,
	onTaskClick,
}: TasksBottomSheetProps) => {
	const filteredTasks = useMemo(() => {
		let filtered = allTasks;

		// Filter by group
		if (selectedGroupIds.length > 0) {
			filtered = filtered.filter((task) => {
				if (selectedGroupIds.includes("no-group") && !task.groupId) {
					return true;
				}
				if (task.groupId && selectedGroupIds.includes(task.groupId)) {
					return true;
				}
				return false;
			});
		}

		// Filter by completion
		if (completionFilter === "completed") {
			filtered = filtered.filter((task) => task.completed);
		} else if (completionFilter === "incomplete") {
			filtered = filtered.filter((task) => !task.completed);
		}

		// Filter out events (tasks that are already in calendar)
		filtered = filtered.filter((task) => task.type !== "event");

		return filtered;
	}, [allTasks, selectedGroupIds, completionFilter]);

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent side="bottom" className="h-[80vh] flex flex-col">
				<SheetHeader>
					<SheetTitle className="flex items-center gap-2">
						<ListTodo className="size-5" />
						Adicionar Tarefa ao Calendário
					</SheetTitle>
					<SheetDescription>
						Toque em uma tarefa para adicionar ao calendário
					</SheetDescription>
				</SheetHeader>

				<div className="flex gap-2 px-4">
					<Select
						value={selectedGroupIds.length === 1 ? selectedGroupIds[0] : "all"}
						onValueChange={(value) => {
							if (value === "all") {
								setSelectedGroupIds([]);
							} else {
								setSelectedGroupIds([value]);
							}
						}}
					>
						<SelectTrigger size="sm" className="w-1/2">
							<SelectValue placeholder="Grupo" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Todos</SelectItem>
							{taskGroupsWithDetails.map((group) => (
								<SelectItem
									key={group.id}
									value={group.id}
									className="truncate"
								>
									<span className="truncate">{group.name}</span>
								</SelectItem>
							))}
							<SelectItem value="no-group">Sem grupo</SelectItem>
						</SelectContent>
					</Select>

					<Select value={completionFilter} onValueChange={setCompletionFilter}>
						<SelectTrigger size="sm" className="w-1/2">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Todos</SelectItem>
							<SelectItem value="incomplete">Não concluídas</SelectItem>
							<SelectItem value="completed">Concluídas</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent">
					{filteredTasks.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center py-8">
							<ListTodo className="size-12 text-muted-foreground/50 mb-2" />
							<p className="text-sm text-muted-foreground">
								Nenhuma tarefa encontrada
							</p>
						</div>
					) : (
						filteredTasks.map((task) => (
							<button
								type="button"
								key={task.id}
								onClick={() => {
									onTaskClick?.(task);
									onOpenChange(false);
								}}
								className="w-full text-left"
							>
								<Card className="p-4 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer bg-card active:scale-[0.98]">
									<div className="space-y-3">
										<div className="flex items-start justify-between gap-2">
											<div className="flex items-center gap-2 flex-1 min-w-0">
												<p className="text-sm font-medium flex-1 line-clamp-2">
													{task.title}
												</p>
											</div>
											<span
												className={cn(
													"rounded-full w-2 h-2 shrink-0 mt-1",
													task.priority === "high" && "bg-red-500",
													task.priority === "medium" && "bg-yellow-500",
													task.priority === "low" && "bg-green-500",
												)}
											/>
										</div>

										{task.description && (
											<p className="text-xs text-muted-foreground line-clamp-2">
												{removeHtmlTags(task.description)}
											</p>
										)}

										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<span className="bg-secondary px-2 py-0.5 rounded">
												{task.groupName}
											</span>
										</div>
									</div>
								</Card>
							</button>
						))
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
};
