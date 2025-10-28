import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";
import { tasksService } from "@/services/tasksService";
import type { ApiError } from "@/types/api";
import type { ApiTask, UpdateTaskData } from "@/types/tasks";

export function useTasks() {
	const queryClient = useQueryClient();

	const {
		data: tasks = [],
		isLoading,
		error,
	} = useQuery<ApiTask[]>({
		queryKey: queryKeys.tasks.all,
		queryFn: tasksService.getAllTasks,
	});

	const createTaskMutation = useMutation({
		mutationFn: tasksService.createTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.taskGroups.all });
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskGroups.withDetails,
			});
			queryClient.invalidateQueries({ queryKey: queryKeys.taskColumns.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.taskStats.all });
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
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all }),
				queryClient.invalidateQueries({ queryKey: queryKeys.taskGroups.all }),
				queryClient.invalidateQueries({
					queryKey: queryKeys.taskGroups.withDetails,
				}),
				queryClient.invalidateQueries({ queryKey: queryKeys.taskColumns.all }),
				queryClient.invalidateQueries({ queryKey: queryKeys.taskStats.all }),
				queryClient.invalidateQueries({ queryKey: ["group-columns"] }),
			]);
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
			queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.taskGroups.all });
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskGroups.withDetails,
			});
			queryClient.invalidateQueries({ queryKey: queryKeys.taskColumns.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.taskStats.all });
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao excluir tarefa. Tente novamente.",
			);
		},
	});

	return {
		tasks,
		isLoading,
		error,
		createTask: createTaskMutation.mutateAsync,
		updateTask: updateTaskMutation.mutateAsync,
		deleteTask: deleteTaskMutation.mutateAsync,
	};
}
