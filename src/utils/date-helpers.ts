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
