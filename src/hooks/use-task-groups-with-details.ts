import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { tasksService } from "@/services/tasksService";
import type { ApiTaskGroup } from "@/types/tasks";

// DEPRECATED: Hook temporário para Calendar
// TODO: Migrar para usar useTasks() + useTaskGroups() separadamente
export function useTaskGroupsWithDetails() {
	const { data: taskGroupsWithDetails = [], isLoading } = useQuery<
		ApiTaskGroup[]
	>({
		queryKey: queryKeys.taskGroups.withDetails,
		queryFn: tasksService.getAllTaskGroupsWithDetails,
	});

	return {
		taskGroupsWithDetails,
		isLoading,
	};
}
