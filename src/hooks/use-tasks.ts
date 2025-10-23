import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tasksService } from "@/services/tasksService";
import type { ApiError } from "@/types/api";
import type { ApiTask, UpdateTaskData } from "@/types/tasks";

const TASKS_QUERY_KEY = ["tasks"] as const;
const ALL_TASKS_QUERY_KEY = ["all-tasks"] as const;
const TASK_GROUPS_WITH_DETAILS_QUERY_KEY = [
	"task-groups-with-details",
] as const;
const TODAY_TASKS_QUERY_KEY = ["today-tasks"] as const;

export function useTasks(selectedGroupId?: string | null) {
	const queryClient = useQueryClient();

	const createTaskMutation = useMutation({
		mutationFn: tasksService.createTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ALL_TASKS_QUERY_KEY });
			queryClient.invalidateQueries({
				queryKey: TASK_GROUPS_WITH_DETAILS_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: TODAY_TASKS_QUERY_KEY });
			if (selectedGroupId) {
				queryClient.invalidateQueries({
					queryKey: [TASKS_QUERY_KEY, "columns", selectedGroupId],
				});
			}
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao criar tarefa. Tente novamente.",
			);
		},
	});

	const updateTaskMutation = useMutation({
		mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskData }) =>
			tasksService.updateTask(taskId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ALL_TASKS_QUERY_KEY });
			queryClient.invalidateQueries({
				queryKey: TASK_GROUPS_WITH_DETAILS_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: TODAY_TASKS_QUERY_KEY });
			if (selectedGroupId) {
				queryClient.invalidateQueries({
					queryKey: [TASKS_QUERY_KEY, "columns", selectedGroupId],
				});
			}
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao atualizar tarefa. Tente novamente.",
			);
		},
	});

	const deleteTaskMutation = useMutation({
		mutationFn: (taskId: string) => tasksService.deleteTask(taskId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ALL_TASKS_QUERY_KEY });
			queryClient.invalidateQueries({
				queryKey: TASK_GROUPS_WITH_DETAILS_QUERY_KEY,
			});
			queryClient.invalidateQueries({ queryKey: TODAY_TASKS_QUERY_KEY });
			if (selectedGroupId) {
				queryClient.invalidateQueries({
					queryKey: [TASKS_QUERY_KEY, "columns", selectedGroupId],
				});
			}
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao excluir tarefa. Tente novamente.",
			);
		},
	});

	return {
		createTask: createTaskMutation.mutateAsync,
		updateTask: updateTaskMutation.mutateAsync,
		deleteTask: deleteTaskMutation.mutateAsync,
	};
}

export function useAllTasks() {
	const {
		data: allTasks = [],
		isLoading,
		error,
	} = useQuery<ApiTask[]>({
		queryKey: ALL_TASKS_QUERY_KEY,
		queryFn: tasksService.getAllTasks,
	});

	return {
		allTasks,
		isLoading,
		error,
	};
}
