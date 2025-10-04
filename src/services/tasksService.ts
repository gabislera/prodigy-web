import { api } from "@/lib/apiClient";

export interface ApiTaskGroup {
	id: string;
	name: string;
	icon: string;
	color: string;
	bgColor: string;
	createdAt: string;
	updatedAt: string;
	columns: Array<{
		id: string;
		title: string;
		groupId: string;
		order: number;
		tasks: ApiTask[];
	}>;
}

export interface ApiTaskColumn {
	id: string;
	title: string;
	groupId: string;
	order: number;
	tasks: ApiTask[];
}

export interface ApiTask {
	id: string;
	title: string;
	description: string;
	priority: "high" | "medium" | "low";
	columnId: string;
	position: number;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateGroupData {
	id?: string;
	name: string;
	icon: string;
	color: string;
	bgColor: string;
}

export interface CreateColumnData {
	groupId: string;
	title: string;
	order: number;
}

export interface CreateTaskData {
	title: string;
	description: string;
	priority: "high" | "medium" | "low";
	columnId: string;
	position: number;
	completed?: boolean;
}

export interface UpdateTaskData {
	title?: string;
	description?: string;
	priority?: "high" | "medium" | "low";
	columnId?: string;
	position?: number;
	completed?: boolean;
}

export interface UpdateGroupData {
	name?: string;
	icon?: string;
	color?: string;
	bgColor?: string;
}

export const tasksService = {
	async getAllTaskGroups(): Promise<ApiTaskGroup[]> {
		const response = await api.get("/task_groups");
		return response.data;
	},

	async createTaskGroup(data: CreateGroupData): Promise<ApiTaskGroup> {
		const response = await api.post("/task_group", data);
		return response.data;
	},

	async getGroupColumns(groupId: string): Promise<ApiTaskColumn[]> {
		const response = await api.get(`/task_groups/${groupId}/columns`);
		return response.data;
	},

	async createTaskColumn(data: CreateColumnData): Promise<ApiTaskColumn> {
		const response = await api.post("/task_column", data);
		return response.data;
	},

	async createTask(data: CreateTaskData): Promise<ApiTask> {
		const response = await api.post("/task", data);
		return response.data;
	},

	async updateTask(taskId: string, data: UpdateTaskData): Promise<ApiTask> {
		const response = await api.put(`/task/${taskId}`, data);
		return response.data;
	},

	async deleteTask(taskId: string): Promise<void> {
		await api.delete(`/task/${taskId}`);
	},

	async updateColumnOrder(
		groupId: string,
		columnOrders: { columnId: string; order: number }[],
	): Promise<void> {
		await api.put(`/task_groups/${groupId}/columns/order`, {
			columnOrders,
		});
	},

	async updateTaskGroup(
		groupId: string,
		data: UpdateGroupData,
	): Promise<ApiTaskGroup> {
		const response = await api.put(`/task_group/${groupId}`, data);
		return response.data;
	},

	async deleteTaskGroup(groupId: string): Promise<void> {
		await api.delete(`/task_group/${groupId}`);
	},
};
