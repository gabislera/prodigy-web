import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	type ApiTaskGroup,
	tasksService,
	type UpdateTaskData,
} from "@/services/tasksService";
import type { TaskGroup } from "@/types/tasks";
import { iconOptions } from "@/utils/taskUtils";

const TASKS_QUERY_KEY = ["tasks"] as const;

// Transform API data to frontend format
function transformTaskGroups(apiData: ApiTaskGroup[]): TaskGroup[] {
	return apiData.map((group) => {
		const iconOption = iconOptions.find(
			(option) => option.value === group.icon,
		);
		return {
			...group,
			icon: iconOption?.icon || iconOptions[0].icon,
			columns: group.columns.map((column) => ({
				...column,
				tasks: column.tasks,
			})),
		};
	});
}

export function useTasks() {
	const queryClient = useQueryClient();

	const { data: rawTaskGroups = [] } = useQuery<ApiTaskGroup[]>({
		queryKey: TASKS_QUERY_KEY,
		queryFn: tasksService.getAllTaskGroups,
	});

	const taskGroups = transformTaskGroups(rawTaskGroups);

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
			// Invalidate and refetch the task groups to get updated data
			queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
		},
	});

	const updateTaskMutation = useMutation({
		mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskData }) =>
			tasksService.updateTask(taskId, data),
		onSuccess: () => {
			// Invalidate and refetch the task groups to get updated data
			queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
		},
	});

	// const createTaskColumnMutation = useMutation({
	// 	mutationFn: tasksService.createTaskColumn,
	// 	onSuccess: (newEvent) => {
	// 		queryClient.setQueryData(TASKS_QUERY_KEY, (old: TaskColumn[] = []) => [
	// 			newEvent,
	// 			...old,
	// 		]);
	// 	},
	// });

	return {
		taskGroups,
		createTaskGroup: createTaskGroupMutation.mutateAsync,
		createTask: createTaskMutation.mutateAsync,
		updateTask: updateTaskMutation.mutateAsync,
	};
}
