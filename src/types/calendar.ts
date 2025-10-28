import type { Task } from "./tasks";

export type ViewType = "month" | "week" | "day";

export type CalendarView = "month" | "week" | "day" | "agenda";

export type CalendarEvent = Task & {
	startDate: string;
	endDate: string;
};
