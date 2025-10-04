import { api } from "@/lib/apiClient";

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

export const calendarService = {
	async getAllEvents(): Promise<Event[]> {
		const response = await api.get("/events");
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
		const response = await api.post("/events", data);
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
		const response = await api.put(`/events/${id}`, data);
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
		await api.delete(`/events/${id}`);
	},
};
