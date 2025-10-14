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

export interface EventApiResponse {
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

export interface UpdateEventData {
	title?: string;
	content?: string;
	startDate?: Date;
	endDate?: Date;
	type?: string;
}

export type ViewType = "month" | "week" | "day";

export interface CalendarDay {
	day: number;
	isCurrentMonth: boolean;
}
