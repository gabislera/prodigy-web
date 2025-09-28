import axios from "axios";

export interface Event {
	id: string;
	title: string;
	content: string;
	startDate: Date;
	endDate: Date;
	type: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateEventData {
	title: string;
	content: string;
	startDate: Date;
	endDate: Date;
	type: string;
}

const API_BASE_URL = "http://localhost:3333";

export const calendarService = {
	async getAllEvents(): Promise<Event[]> {
		const response = await axios.get(`${API_BASE_URL}/events`);
		return response.data;
	},

	async createEvent(data: CreateEventData): Promise<Event> {
		const response = await axios.post(`${API_BASE_URL}/events`, data);
		return response.data;
	},

	async updateEvent(
		id: string,
		data: Partial<CreateEventData>,
	): Promise<Event> {
		const response = await axios.put(`${API_BASE_URL}/events/${id}`, data);
		return response.data;
	},

	async deleteEvent(id: string): Promise<void> {
		await axios.delete(`${API_BASE_URL}/events/${id}`);
	},
};
