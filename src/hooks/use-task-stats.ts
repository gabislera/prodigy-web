import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { tasksService } from "@/services/tasksService";

interface TaskStats {
	totalTasks: number;
	completedTasks: number;
	inProgressTasks: number;
	todayTasks: number;
	efficiency: number;
}

export function useTaskStats() {
	const { data, isLoading, error } = useQuery<TaskStats>({
		queryKey: queryKeys.taskStats.all,
		queryFn: tasksService.getTaskStats,
	});

	return {
		stats: data || {
			totalTasks: 0,
			completedTasks: 0,
			inProgressTasks: 0,
			todayTasks: 0,
			efficiency: 0,
		},
		isLoading,
		error,
	};
}
