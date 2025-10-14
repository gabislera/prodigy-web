import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tasksService } from "@/services/tasksService";
import type { ApiError } from "@/types/api";
import type {
	ApiTaskColumn,
	ApiTaskGroup,
	TaskGroup,
	UpdateTaskData,
	UpdateTaskGroupData,
} from "@/types/tasks";

const TASKS_QUERY_KEY = ["tasks"] as const;

export function useTasks(selectedGroupId?: string | null) {
	const queryClient = useQueryClient();

	const { data: taskGroups = [] } = useQuery<ApiTaskGroup[]>({
		queryKey: TASKS_QUERY_KEY,
		queryFn: tasksService.getAllTaskGroups,
	});

	const { data: taskColumns = [] } = useQuery<ApiTaskColumn[]>({
		queryKey: [TASKS_QUERY_KEY, "columns", selectedGroupId],
		queryFn: () => {
			if (!selectedGroupId) throw new Error("groupId é obrigatório");
			return tasksService.getGroupColumns(selectedGroupId);
		},
		enabled: !!selectedGroupId,
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

	const createTaskMutation = useMutation({
		mutationFn: tasksService.createTask,
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
					"Erro ao criar tarefa. Tente novamente.",
			);
		},
	});

	const updateTaskMutation = useMutation({
		mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskData }) =>
			tasksService.updateTask(taskId, data),
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
					"Erro ao atualizar tarefa. Tente novamente.",
			);
		},
	});

	const deleteTaskMutation = useMutation({
		mutationFn: (taskId: string) => tasksService.deleteTask(taskId),
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
					"Erro ao excluir tarefa. Tente novamente.",
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
		taskColumns,
		createTaskGroup: createTaskGroupMutation.mutateAsync,
		createTask: createTaskMutation.mutateAsync,
		updateTask: updateTaskMutation.mutateAsync,
		deleteTask: deleteTaskMutation.mutateAsync,
		updateColumnOrder: updateColumnOrderMutation.mutateAsync,
		updateTaskGroup: updateTaskGroupMutation.mutateAsync,
		deleteTaskGroup: deleteTaskGroupMutation.mutateAsync,
	};
}
