import { api } from "@/lib/apiClient";
import type {
	ApiTask,
	ApiTaskColumn,
	ApiTaskGroup,
	CreateTaskColumnData,
	CreateTaskData,
	CreateTaskGroupData,
	UpdateTaskData,
	UpdateTaskGroupData,
} from "@/types/tasks";

export const tasksService = {
	async getAllTasks(): Promise<ApiTask[]> {
		const response = await api.get("/tasks");
		return response.data;
	},

	async getAllTaskGroups(): Promise<ApiTaskGroup[]> {
		const response = await api.get("/groups");
		return response.data;
	},

	async getAllTaskGroupsWithDetails(): Promise<ApiTaskGroup[]> {
		const response = await api.get("/groups/with-details");
		return response.data;
	},

	async createTaskGroup(data: CreateTaskGroupData): Promise<ApiTaskGroup> {
		const response = await api.post("/groups", data);
		return response.data;
	},

	async getGroupColumns(groupId: string): Promise<ApiTaskColumn[]> {
		const response = await api.get(`/columns/${groupId}`);
		return response.data;
	},

	async createTaskColumn(data: CreateTaskColumnData): Promise<ApiTaskColumn> {
		const response = await api.post("/columns", data);
		return response.data;
	},

	async createTask(data: CreateTaskData): Promise<ApiTask> {
		const formattedData = {
			...data,
			startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
			endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
		};

		const response = await api.post("/tasks", formattedData);
		return response.data;
	},

	async updateTask(taskId: string, data: UpdateTaskData): Promise<ApiTask> {
		const formattedData = {
			...data,
			startDate: data.startDate
				? new Date(data.startDate).toISOString()
				: data.startDate,
			endDate: data.endDate
				? new Date(data.endDate).toISOString()
				: data.endDate,
		};

		const response = await api.put(`/tasks/${taskId}`, formattedData);
		return response.data;
	},

	async deleteTask(taskId: string): Promise<void> {
		await api.delete(`/tasks/${taskId}`);
	},

	async updateColumnOrder(
		groupId: string,
		columnOrders: { columnId: string; order: number }[],
	): Promise<void> {
		await api.put(`/columns${groupId}/order`, {
			columnOrders,
		});
	},

	async updateTaskGroup(
		groupId: string,
		data: UpdateTaskGroupData,
	): Promise<ApiTaskGroup> {
		const response = await api.put(`/groups/${groupId}`, data);
		return response.data;
	},

	async deleteTaskGroup(groupId: string): Promise<void> {
		await api.delete(`/groups/${groupId}`);
	},
};
