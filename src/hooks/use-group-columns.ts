import { useQuery } from "@tanstack/react-query";
import { tasksService } from "@/services/tasksService";
import type { ApiTaskColumn } from "@/types/tasks";

// Busca colunas com tasks de um grupo específico
export function useGroupColumns(groupId: string | null) {
	const {
		data: columns = [],
		isLoading,
		error,
	} = useQuery<ApiTaskColumn[]>({
		queryKey: ["group-columns", groupId],
		queryFn: () => tasksService.getGroupColumnsWithTasks(groupId!),
		enabled: !!groupId, // Só busca quando groupId existe
	});

	return {
		columns,
		isLoading,
		error,
	};
}
