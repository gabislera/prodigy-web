import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";
import { tasksService } from "@/services/tasksService";
import type { ApiError } from "@/types/api";

export function useTaskColumns() {
	const queryClient = useQueryClient();

	// Mutations de colunas
	const createTaskColumnMutation = useMutation({
		mutationFn: (data: {
			groupId: string;
			title: string;
			order: number;
		}) => tasksService.createTaskColumn(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.taskColumns.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.taskGroups.withDetails });
			toast.success("Coluna criada com sucesso!");
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao criar coluna. Tente novamente.",
			);
		},
	});

	const updateTaskColumnMutation = useMutation({
		mutationFn: ({
			columnId,
			title,
		}: {
			columnId: string;
			title: string;
		}) => tasksService.updateTaskColumn(columnId, { title }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.taskColumns.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.taskGroups.withDetails });
			toast.success("Coluna atualizada com sucesso!");
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao atualizar coluna. Tente novamente.",
			);
		},
	});

	const deleteTaskColumnMutation = useMutation({
		mutationFn: (columnId: string) => tasksService.deleteTaskColumn(columnId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.taskColumns.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.taskGroups.withDetails });
			toast.success("Coluna excluída com sucesso!");
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao excluir coluna. Tente novamente.",
			);
		},
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
			queryClient.invalidateQueries({ queryKey: queryKeys.taskColumns.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.taskGroups.withDetails });
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao atualizar ordem das colunas. Tente novamente.",
			);
		},
	});

	return {
		createTaskColumn: createTaskColumnMutation.mutateAsync,
		updateTaskColumn: updateTaskColumnMutation.mutateAsync,
		deleteTaskColumn: deleteTaskColumnMutation.mutateAsync,
		updateColumnOrder: updateColumnOrderMutation.mutateAsync,
	};
}
