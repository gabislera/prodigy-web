import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tasksService } from "@/services/tasksService";
import type { ApiError } from "@/types/api";
import type { ApiTaskGroup, UpdateTaskGroupData } from "@/types/tasks";

const TASK_GROUPS_WITH_DETAILS_QUERY_KEY = [
	"task-groups-with-details",
] as const;

export function useTaskGroupsWithDetails() {
	const queryClient = useQueryClient();

	const { data: taskGroupsWithDetails = [], isLoading } = useQuery<
		ApiTaskGroup[]
	>({
		queryKey: TASK_GROUPS_WITH_DETAILS_QUERY_KEY,
		queryFn: tasksService.getAllTaskGroupsWithDetails,
	});

	const createTaskGroupMutation = useMutation({
		mutationFn: tasksService.createTaskGroup,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: TASK_GROUPS_WITH_DETAILS_QUERY_KEY,
			});
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao criar grupo de tarefas. Tente novamente.",
			);
		},
	});

	const updateTaskGroupMutation = useMutation({
		mutationFn: ({
			groupId,
			data,
		}: {
			groupId: string;
			data: UpdateTaskGroupData;
		}) => tasksService.updateTaskGroup(groupId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: TASK_GROUPS_WITH_DETAILS_QUERY_KEY,
			});
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao atualizar grupo de tarefas. Tente novamente.",
			);
		},
	});

	const deleteTaskGroupMutation = useMutation({
		mutationFn: (groupId: string) => tasksService.deleteTaskGroup(groupId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: TASK_GROUPS_WITH_DETAILS_QUERY_KEY,
			});
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao excluir grupo de tarefas. Tente novamente.",
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
			queryClient.invalidateQueries({
				queryKey: TASK_GROUPS_WITH_DETAILS_QUERY_KEY,
			});
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao atualizar ordem das colunas. Tente novamente.",
			);
		},
	});

	const createTaskColumnMutation = useMutation({
		mutationFn: (data: {
			groupId: string;
			title: string;
			order: number;
		}) => tasksService.createTaskColumn(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: TASK_GROUPS_WITH_DETAILS_QUERY_KEY,
			});
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
			queryClient.invalidateQueries({
				queryKey: TASK_GROUPS_WITH_DETAILS_QUERY_KEY,
			});
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
			queryClient.invalidateQueries({
				queryKey: TASK_GROUPS_WITH_DETAILS_QUERY_KEY,
			});
			toast.success("Coluna excluída com sucesso!");
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao excluir coluna. Tente novamente.",
			);
		},
	});

	return {
		taskGroupsWithDetails,
		isLoading,
		createTaskGroup: createTaskGroupMutation.mutateAsync,
		updateTaskGroup: updateTaskGroupMutation.mutateAsync,
		deleteTaskGroup: deleteTaskGroupMutation.mutateAsync,
		updateColumnOrder: updateColumnOrderMutation.mutateAsync,
		createTaskColumn: createTaskColumnMutation.mutateAsync,
		updateTaskColumn: updateTaskColumnMutation.mutateAsync,
		deleteTaskColumn: deleteTaskColumnMutation.mutateAsync,
	};
}
