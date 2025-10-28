import { api } from "@/lib/apiClient";
import type {
	Task,
	TaskColumn,
	TaskGroup,
	CreateTaskColumnData,
	CreateTaskData,
	CreateTaskGroupData,
	UpdateTaskData,
	UpdateTaskGroupData,
} from "@/types/tasks";

export const tasksService = {
	async getAllTasks(): Promise<Task[]> {
		const response = await api.get("/tasks");
		return response.data;
	},

	// Lista simples de grupos (para /tasks)
	async getAllTaskGroups(): Promise<TaskGroup[]> {
		const response = await api.get("/groups");
		return response.data;
	},

	// DEPRECATED: Manter temporariamente para Calendar
	// TODO: Migrar Calendar para usar getAllTasks() + getAllTaskGroups()
	async getAllTaskGroupsWithDetails(): Promise<TaskGroup[]> {
		const response = await api.get("/groups/with-details");
		return response.data;
	},

	async createTaskGroup(data: CreateTaskGroupData): Promise<TaskGroup> {
		const response = await api.post("/groups", data);
		return response.data;
	},

	async getGroupColumns(groupId: string): Promise<TaskColumn[]> {
		const response = await api.get(`/columns/${groupId}`);
		return response.data;
	},

	async createTaskColumn(data: CreateTaskColumnData): Promise<TaskColumn> {
		const response = await api.post("/columns", data);
		return response.data;
	},

	async updateTaskColumn(
		columnId: string,
		data: { title: string },
	): Promise<TaskColumn> {
		const response = await api.put(`/columns/${columnId}`, data);
		return response.data;
	},

	async deleteTaskColumn(columnId: string): Promise<void> {
		await api.delete(`/columns/${columnId}`);
	},

	async createTask(data: CreateTaskData): Promise<Task> {
		const response = await api.post("/tasks", data);
		return response.data;
	},

	async updateTask(taskId: string, data: UpdateTaskData): Promise<Task> {
		const response = await api.put(`/tasks/${taskId}`, data);
		return response.data;
	},

	async deleteTask(taskId: string): Promise<void> {
		await api.delete(`/tasks/${taskId}`);
	},

	async updateColumnOrder(
		groupId: string,
		columnOrders: { columnId: string; order: number }[],
	): Promise<void> {
		await api.put(`/columns/${groupId}/order`, {
			columnOrders,
		});
	},

	async updateTaskGroup(
		groupId: string,
		data: UpdateTaskGroupData,
	): Promise<TaskGroup> {
		const response = await api.put(`/groups/${groupId}`, data);
		return response.data;
	},

	async deleteTaskGroup(groupId: string): Promise<void> {
		await api.delete(`/groups/${groupId}`);
	},

	// Novo: Estatísticas globais para Dashboard
	async getTaskStats(): Promise<{
		totalTasks: number;
		completedTasks: number;
		inProgressTasks: number;
		todayTasks: number;
		efficiency: number;
	}> {
		const response = await api.get("/groups/stats");
		return response.data;
	},

	// Novo: Buscar colunas com tasks de um grupo específico
	async getGroupColumnsWithTasks(
		groupId: string,
	): Promise<TaskColumn[]> {
		const response = await api.get(`/columns/${groupId}`);
		return response.data;
	},
};
