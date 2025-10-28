import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { tasksService } from "@/services/tasksService";
import type { TaskGroup } from "@/types/tasks";

// DEPRECATED: Hook temporário para Calendar
// TODO: Migrar para usar useTasks() + useTaskGroups() separadamente
export function useTaskGroupsWithDetails() {
	const { data: taskGroupsWithDetails = [], isLoading } = useQuery<
		TaskGroup[]
	>({
		queryKey: queryKeys.taskGroups.withDetails,
		queryFn: tasksService.getAllTaskGroupsWithDetails,
	});

	return {
		taskGroupsWithDetails,
		isLoading,
	};
}
