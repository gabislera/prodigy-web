export interface Event {
	id: number;
	title: string;
	date: number | Date;
	startDate: Date;
	endDate: Date;
	type: string;
	description?: string;
}

export type ViewType = "month" | "week" | "day";

export interface CalendarDay {
	day: number;
	isCurrentMonth: boolean;
}
