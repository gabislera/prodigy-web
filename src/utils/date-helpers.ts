import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dateFnsLocale = ptBR;

/**
 * Format a date to a time string (HH:mm)
 */
export const formatTimeFromDate = (date: Date): string => {
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${hours}:${minutes}`;
};

/**
 * Combine a date with a time string (HH:mm) and return a new Date
 */
export const combineDateAndTime = (date: Date, time: string): Date => {
	const [hours, minutes] = time.split(":").map(Number);
	const combined = new Date(date);
	combined.setHours(hours, minutes, 0, 0);
	return combined;
};

/**
 * Return default times (now and +30 minutes)
 */
export const getDefaultTimes = () => {
	const now = new Date();
	const later = new Date(now.getTime() + 30 * 60000); // +30 minutes
	return {
		start: formatTimeFromDate(now),
		end: formatTimeFromDate(later),
	};
};

/**
 * Return default date/times for calendar events
 * Rounds to next 15-minute interval and adds 1 hour duration
 */
export const getDefaultEventTimes = () => {
	const now = new Date();
	const startDate = new Date(now);

	// Round up to next 15-minute interval
	const minutes = now.getMinutes();
	const roundedMinutes = Math.ceil(minutes / 15) * 15;
	startDate.setMinutes(roundedMinutes);
	startDate.setSeconds(0);
	startDate.setMilliseconds(0);

	// Add 1 hour for end time
	const endDate = new Date(startDate);
	endDate.setHours(startDate.getHours() + 1);

	return {
		start: startDate,
		end: endDate,
	};
};

/**
 * Format the time range of a task for display
 */
export function formatTaskTimeRange(
	startDate: string,
	endDate: string,
): string | null {
	if (!startDate || !endDate) return null;

	try {
		const start = parseISO(startDate);
		const end = parseISO(endDate);

		const startTime = format(start, "HH:mm", { locale: ptBR });
		const endTime = format(end, "HH:mm", { locale: ptBR });

		return `${startTime} - ${endTime}`;
	} catch (error) {
		console.warn("Erro ao formatar horário da tarefa:", error);
		return null;
	}
}

/**
 * Format a date for display in Brazilian Portuguese
 */
export function formatDate(
	date: string | Date,
	formatString: string = "dd/MM/yyyy",
): string {
	try {
		const dateObj = typeof date === "string" ? parseISO(date) : date;
		return format(dateObj, formatString, { locale: ptBR });
	} catch (error) {
		console.warn("Erro ao formatar data:", error);
		return "Data inválida";
	}
}

/**
 * Format a date for display in simple time format (HH:mm)
 */
export function formatTimeSimple(date: string | Date): string {
	try {
		const dateObj = typeof date === "string" ? parseISO(date) : date;
		return format(dateObj, "HH:mm", { locale: ptBR });
	} catch (error) {
		console.warn("Erro ao formatar horário:", error);
		return "Horário inválido";
	}
}

/**
 * Unified function for formatting time
 * Automatically detect the type of input and format accordingly
 */
export function formatTime(input: number | string | Date): string {
	if (typeof input === "number") {
		// Format for timer (milliseconds → MM:SS)
		const totalSeconds = Math.ceil(input / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	} else {
		// Format for time (date → HH:mm)
		return formatTimeSimple(input);
	}
}
