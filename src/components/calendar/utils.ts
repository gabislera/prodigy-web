import { isSameDay } from "date-fns";

import type { CalendarEvent } from ".";

/**
 * Get CSS classes for event colors based on priority
 */
export function getEventColorClasses(
	priority: "high" | "medium" | "low",
): string {
	switch (priority) {
		case "high":
			return "bg-rose-200/50 hover:bg-rose-200/40 text-rose-950/80 dark:bg-rose-400/25 dark:hover:bg-rose-400/20 dark:text-rose-200 shadow-rose-700/8";
		case "medium":
			return "bg-amber-200/50 hover:bg-amber-200/40 text-amber-950/80 dark:bg-amber-400/25 dark:hover:bg-amber-400/20 dark:text-amber-200 shadow-amber-700/8";
		case "low":
			return "bg-emerald-200/50 hover:bg-emerald-200/40 text-emerald-950/80 dark:bg-emerald-400/25 dark:hover:bg-emerald-400/20 dark:text-emerald-200 shadow-emerald-700/8";
		default:
			return "bg-sky-200/50 hover:bg-sky-200/40 text-sky-950/80 dark:bg-sky-400/25 dark:hover:bg-sky-400/20 dark:text-sky-200 shadow-sky-700/8";
	}
}

/**
 * Get CSS classes for border radius based on event position in multi-day events
 */
export function getBorderRadiusClasses(
	isFirstDay: boolean,
	isLastDay: boolean,
): string {
	if (isFirstDay && isLastDay) {
		return "rounded"; // Both ends rounded
	} else if (isFirstDay) {
		return "rounded-l rounded-r-none"; // Only left end rounded
	} else if (isLastDay) {
		return "rounded-r rounded-l-none"; // Only right end rounded
	} else {
		return "rounded-none"; // No rounded corners
	}
}

/**
 * Check if an event is a multi-day event
 */
export function isMultiDayEvent(event: CalendarEvent): boolean {
	const eventStart = new Date(event.startDate);
	const eventEnd = new Date(event.endDate);
	return event.allDay || eventStart.getDate() !== eventEnd.getDate();
}

/**
 * Filter events for a specific day
 */
export function getEventsForDay(
	events: CalendarEvent[],
	day: Date,
): CalendarEvent[] {
	return events
		.filter((event) => {
			const eventStart = new Date(event.startDate);
			return isSameDay(day, eventStart);
		})
		.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

/**
 * Sort events with multi-day events first, then by start time
 */
export function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
	return [...events].sort((a, b) => {
		const aIsMultiDay = isMultiDayEvent(a);
		const bIsMultiDay = isMultiDayEvent(b);

		if (aIsMultiDay && !bIsMultiDay) return -1;
		if (!aIsMultiDay && bIsMultiDay) return 1;

		return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
	});
}

/**
 * Get multi-day events that span across a specific day (but don't start on that day)
 */
export function getSpanningEventsForDay(
	events: CalendarEvent[],
	day: Date,
): CalendarEvent[] {
	return events.filter((event) => {
		if (!isMultiDayEvent(event)) return false;

		const eventStart = new Date(event.startDate);
		const eventEnd = new Date(event.endDate);

		// Only include if it's not the start day but is either the end day or a middle day
		return (
			!isSameDay(day, eventStart) &&
			(isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd))
		);
	});
}

/**
 * Get all events visible on a specific day (starting, ending, or spanning)
 */
export function getAllEventsForDay(
	events: CalendarEvent[],
	day: Date,
): CalendarEvent[] {
	return events.filter((event) => {
		const eventStart = new Date(event.startDate);
		const eventEnd = new Date(event.endDate);
		return (
			isSameDay(day, eventStart) ||
			isSameDay(day, eventEnd) ||
			(day > eventStart && day < eventEnd)
		);
	});
}

/**
 * Get all events for a day (for agenda view)
 */
export function getAgendaEventsForDay(
	events: CalendarEvent[],
	day: Date,
): CalendarEvent[] {
	return events
		.filter((event) => {
			const eventStart = new Date(event.startDate);
			const eventEnd = new Date(event.endDate);
			return (
				isSameDay(day, eventStart) ||
				isSameDay(day, eventEnd) ||
				(day > eventStart && day < eventEnd)
			);
		})
		.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

/**
 * Add hours to a date
 */
export function addHoursToDate(date: Date, hours: number): Date {
	const result = new Date(date);
	result.setHours(result.getHours() + hours);
	return result;
}
