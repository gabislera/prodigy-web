import { useQuery } from "@tanstack/react-query";
import { tasksService } from "@/services/tasksService";
import type { ApiTaskGroup } from "@/types/tasks";

// DEPRECATED: Hook temporário para Calendar
// TODO: Migrar para usar useTasks() + useTaskGroups() separadamente
export function useTaskGroupsWithDetails() {
	const { data: taskGroupsWithDetails = [], isLoading } = useQuery<
		ApiTaskGroup[]
	>({
		queryKey: ["task-groups-with-details"],
		queryFn: tasksService.getAllTaskGroupsWithDetails,
	});

	return {
		taskGroupsWithDetails,
		isLoading,
	};
}
