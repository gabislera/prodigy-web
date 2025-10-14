import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tasksService } from "@/services/tasksService";
import type { ApiError } from "@/types/api";
import type {
	ApiTaskGroup,
	TaskGroup,
	UpdateTaskGroupData,
} from "@/types/tasks";

const TASKS_QUERY_KEY = ["tasks"] as const;

export function useTaskGroups() {
	const queryClient = useQueryClient();

	const { data: taskGroups = [] } = useQuery<ApiTaskGroup[]>({
		queryKey: TASKS_QUERY_KEY,
		queryFn: tasksService.getAllTaskGroups,
	});

	const createTaskGroupMutation = useMutation({
		mutationFn: tasksService.createTaskGroup,
		onSuccess: (newEvent) => {
			queryClient.setQueryData(TASKS_QUERY_KEY, (old: TaskGroup[] = []) => [
				newEvent,
				...old,
			]);
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
			queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
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
			queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
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
		createTaskGroup: createTaskGroupMutation.mutateAsync,
		updateTaskGroup: updateTaskGroupMutation.mutateAsync,
		deleteTaskGroup: deleteTaskGroupMutation.mutateAsync,
	};
}
