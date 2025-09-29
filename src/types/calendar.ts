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

export type ViewType = "month" | "week" | "day";

export interface CalendarDay {
	day: number;
	isCurrentMonth: boolean;
}
