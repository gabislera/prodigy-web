import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { tasksService } from "@/services/tasksService";
import type { TaskColumn } from "@/types/tasks";

// Busca colunas com tasks de um grupo específico
export function useGroupColumns(groupId: string | null) {
	const {
		data: columns = [],
		isLoading,
		error,
	} = useQuery<TaskColumn[]>({
		queryKey: groupId
			? queryKeys.taskColumns.groupColumns(groupId)
			: ["group-columns", null],
		queryFn: () => tasksService.getGroupColumnsWithTasks(groupId!),
		enabled: !!groupId,
	});

	return {
		columns,
		isLoading,
		error,
	};
}
