import axios from "axios";

export interface Task {
	id: string;
	title: string;
	content: string;
	startDate: Date;
	endDate: Date;
	type: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateTaskData {
	title: string;
	content: string;
	startDate: Date;
	endDate: Date;
	type: string;
}

const API_BASE_URL = "http://localhost:3333";

export const calendarService = {
	async getAllTasks(): Promise<Task[]> {
		const response = await axios.get(`${API_BASE_URL}/tasks`);
		return response.data;
	},

	async createTask(data: CreateTaskData): Promise<Task> {
		const response = await axios.post(`${API_BASE_URL}/tasks`, data);
		return response.data;
	},

	async updateTask(id: string, data: Partial<CreateTaskData>): Promise<Task> {
		const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, data);
		return response.data;
	},

	async deleteTask(id: string): Promise<void> {
		await axios.delete(`${API_BASE_URL}/tasks/${id}`);
	},
};
