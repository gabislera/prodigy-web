import type { Event } from "@/types/calendar";

export const mockEvents: Event[] = [
	{
		id: 1,
		title: "Independência",
		date: 7,
		type: "holiday",
		startDate: new Date(2024, 8, 7, 0, 0, 0), // 7 de setembro, dia todo
		endDate: new Date(2024, 8, 7, 23, 59, 59),
	},
	{
		id: 2,
		title: "CSG Video Interview",
		date: 16,
		type: "meeting",
		startDate: new Date(2024, 8, 16, 14, 0, 0), // 16 de setembro, 14:00
		endDate: new Date(2024, 8, 16, 15, 0, 0), // 16 de setembro, 15:00
	},
	{
		id: 3,
		title: "Parabéns!",
		date: 24,
		type: "birthday",
		startDate: new Date(2024, 8, 24, 0, 0, 0), // 24 de setembro, dia todo
		endDate: new Date(2024, 8, 24, 23, 59, 59),
	},
	{
		id: 4,
		title: "CSG Video Interview",
		date: 23,
		type: "meeting",
		startDate: new Date(2024, 8, 23, 13, 0, 0), // 23 de setembro, 13:00
		endDate: new Date(2024, 8, 23, 14, 0, 0), // 23 de setembro, 14:00
	},
];

export const monthNames = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro",
];

export const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const weekDayNames = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

export const calendarUtils = {
	isToday: (
		day: number,
		currentMonth: number,
		currentYear: number,
	): boolean => {
		const today = new Date();
		return (
			day === today.getDate() &&
			currentMonth === today.getMonth() &&
			currentYear === today.getFullYear()
		);
	},

	formatHour: (hour: number): string => {
		if (hour === 0) return "12 AM";
		if (hour < 12) return `${hour} AM`;
		if (hour === 12) return "12 PM";
		return `${hour - 12} PM`;
	},

	getDaysInMonth: (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days = [];

		// Previous month days
		for (let i = startingDayOfWeek - 1; i >= 0; i--) {
			days.push({
				day: new Date(year, month, -i).getDate(),
				isCurrentMonth: false,
			});
		}

		// Current month days
		for (let day = 1; day <= daysInMonth; day++) {
			days.push({
				day,
				isCurrentMonth: true,
			});
		}

		// Next month days
		const remainingDays = 42 - days.length;
		for (let day = 1; day <= remainingDays; day++) {
			days.push({
				day,
				isCurrentMonth: false,
			});
		}

		return days;
	},

	getWeekDays: (date: Date): Date[] => {
		const startOfWeek = new Date(date);
		const day = startOfWeek.getDay();
		const diff = startOfWeek.getDate() - day;
		startOfWeek.setDate(diff);

		const weekDays = [];
		for (let i = 0; i < 7; i++) {
			const currentDay = new Date(startOfWeek);
			currentDay.setDate(startOfWeek.getDate() + i);
			weekDays.push(currentDay);
		}

		return weekDays;
	},
};
