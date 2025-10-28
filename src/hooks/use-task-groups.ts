import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";
import { tasksService } from "@/services/tasksService";
import type { ApiError } from "@/types/api";
import type { TaskGroup, UpdateTaskGroupData } from "@/types/tasks";

export function useTaskGroups() {
	const queryClient = useQueryClient();

	const { data: taskGroups = [], isLoading } = useQuery<TaskGroup[]>({
		queryKey: queryKeys.taskGroups.all,
		queryFn: tasksService.getAllTaskGroups,
	});

	const createTaskGroupMutation = useMutation({
		mutationFn: tasksService.createTaskGroup,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskGroups.all,
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
				queryKey: queryKeys.taskGroups.all,
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
				queryKey: queryKeys.taskGroups.all,
			});
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao excluir grupo de tarefas. Tente novamente.",
			);
		},
	});

	return {
		taskGroups,
		isLoading,
		createTaskGroup: createTaskGroupMutation.mutateAsync,
		updateTaskGroup: updateTaskGroupMutation.mutateAsync,
		deleteTaskGroup: deleteTaskGroupMutation.mutateAsync,
	};
}
