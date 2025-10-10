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
	startDate?: string | null;
	endDate?: string | null;
	allDay?: boolean;
	status?: string;
	type?: string;
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
	description?: string;
	priority: "high" | "medium" | "low";
	columnId: string;
	position: number;
	completed?: boolean;
	startDate?: string | null;
	endDate?: string | null;
	allDay?: boolean;
	status?: string;
}

export interface UpdateTaskData {
	title?: string;
	description?: string;
	priority?: "high" | "medium" | "low";
	columnId?: string;
	position?: number;
	completed?: boolean;
	startDate?: string | null;
	endDate?: string | null;
	allDay?: boolean;
	status?: string;
}

export interface UpdateGroupData {
	name?: string;
	icon?: string;
	color?: string;
	bgColor?: string;
}

export const tasksService = {
	async getAllTaskGroups(): Promise<ApiTaskGroup[]> {
		const response = await api.get("/groups");
		return response.data;
	},

	async createTaskGroup(data: CreateGroupData): Promise<ApiTaskGroup> {
		const response = await api.post("/groups", data);
		return response.data;
	},

	async getGroupColumns(groupId: string): Promise<ApiTaskColumn[]> {
		const response = await api.get(`/columns/${groupId}`);
		return response.data;
	},

	async createTaskColumn(data: CreateColumnData): Promise<ApiTaskColumn> {
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
		data: UpdateGroupData,
	): Promise<ApiTaskGroup> {
		const response = await api.put(`/groups/${groupId}`, data);
		return response.data;
	},

	async deleteTaskGroup(groupId: string): Promise<void> {
		await api.delete(`/groups/${groupId}`);
	},
};
