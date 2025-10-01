// hooks/use-tasks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	type ApiTaskColumn,
	type ApiTaskGroup,
	tasksService,
	type UpdateTaskData,
} from "@/services/tasksService";
import type { TaskGroup } from "@/types/tasks";

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
	});

	return {
		taskGroups,
		taskColumns,
		createTaskGroup: createTaskGroupMutation.mutateAsync,
		createTask: createTaskMutation.mutateAsync,
		updateTask: updateTaskMutation.mutateAsync,
		deleteTask: deleteTaskMutation.mutateAsync,
	};
}
