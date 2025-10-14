import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tasksService } from "@/services/tasksService";
import type { ApiError } from "@/types/api";
import type { ApiTaskColumn } from "@/types/tasks";

const TASKS_QUERY_KEY = ["tasks"] as const;

export function useTaskColumns(selectedGroupId?: string | null) {
	const queryClient = useQueryClient();

	const { data: taskColumns = [] } = useQuery<ApiTaskColumn[]>({
		queryKey: [TASKS_QUERY_KEY, "columns", selectedGroupId],
		queryFn: () => {
			if (!selectedGroupId) throw new Error("groupId é obrigatório");
			return tasksService.getGroupColumns(selectedGroupId);
		},
		enabled: !!selectedGroupId,
	});

	const updateColumnOrderMutation = useMutation({
		mutationFn: ({
			groupId,
			columnOrders,
		}: {
			groupId: string;
			columnOrders: { columnId: string; order: number }[];
		}) => tasksService.updateColumnOrder(groupId, columnOrders),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
			if (selectedGroupId) {
				queryClient.invalidateQueries({
					queryKey: [TASKS_QUERY_KEY, "columns", selectedGroupId],
				});
			}
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao atualizar ordem das colunas. Tente novamente.",
			);
		},
	});

	return {
		taskColumns,
		updateColumnOrder: updateColumnOrderMutation.mutateAsync,
	};
}
