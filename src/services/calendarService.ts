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

interface EventApiResponse {
	id: string;
	title: string;
	content: string;
	startDate: string;
	endDate: string;
	type: string;
	createdAt: string;
	updatedAt: string;
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
		// Convert date strings to Date objects
		return response.data.map((event: EventApiResponse) => ({
			...event,
			startDate: new Date(event.startDate),
			endDate: new Date(event.endDate),
			createdAt: new Date(event.createdAt),
			updatedAt: new Date(event.updatedAt),
		}));
	},

	async createEvent(data: CreateEventData): Promise<Event> {
		const response = await axios.post(`${API_BASE_URL}/events`, data);
		// Convert date strings to Date objects
		const event: EventApiResponse = response.data;
		return {
			...event,
			startDate: new Date(event.startDate),
			endDate: new Date(event.endDate),
			createdAt: new Date(event.createdAt),
			updatedAt: new Date(event.updatedAt),
		};
	},

	async updateEvent(
		id: string,
		data: Partial<CreateEventData>,
	): Promise<Event> {
		const response = await axios.put(`${API_BASE_URL}/events/${id}`, data);
		// Convert date strings to Date objects
		const event: EventApiResponse = response.data;
		return {
			...event,
			startDate: new Date(event.startDate),
			endDate: new Date(event.endDate),
			createdAt: new Date(event.createdAt),
			updatedAt: new Date(event.updatedAt),
		};
	},

	async deleteEvent(id: string): Promise<void> {
		await axios.delete(`${API_BASE_URL}/events/${id}`);
	},
};
