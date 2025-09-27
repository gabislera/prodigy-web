import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
	AIDialog,
	CalendarHeader,
	DayView,
	MonthView,
	TaskDetailsDialog,
	TaskDialog,
	WeekView,
} from "@/components/calendar";
import {
	calendarUtils,
	mockEvents,
	monthNames,
} from "@/services/calendarService";
import type { Event, ViewType } from "@/types/calendar";

export const Route = createFileRoute("/_protected/calendar")({
	component: CalendarPage,
});

function CalendarPage() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [viewType, setViewType] = useState<ViewType>("month");
	const [aiDialogOpen, setAiDialogOpen] = useState(false);
	const [taskDialogOpen, setTaskDialogOpen] = useState(false);
	const [taskDetailsDialogOpen, setTaskDetailsDialogOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedTask, setSelectedTask] = useState<Event | null>(null);

	const navigateMonth = (direction: "prev" | "next") => {
		const newDate = new Date(currentDate);
		if (direction === "prev") {
			newDate.setMonth(currentDate.getMonth() - 1);
		} else {
			newDate.setMonth(currentDate.getMonth() + 1);
		}
		setCurrentDate(newDate);
	};

	const navigateWeek = (direction: "prev" | "next") => {
		const newDate = new Date(currentDate);
		const days = direction === "prev" ? -7 : 7;
		newDate.setDate(currentDate.getDate() + days);
		setCurrentDate(newDate);
	};

	const navigateDay = (direction: "prev" | "next") => {
		const newDate = new Date(currentDate);
		const days = direction === "prev" ? -1 : 1;
		newDate.setDate(currentDate.getDate() + days);
		setCurrentDate(newDate);
	};

	const handleNavigate = (direction: "prev" | "next") => {
		switch (viewType) {
			case "month":
				navigateMonth(direction);
				break;
			case "week":
				navigateWeek(direction);
				break;
			case "day":
				navigateDay(direction);
				break;
		}
	};

	const getDateTitle = () => {
		switch (viewType) {
			case "month":
				return `${monthNames[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;
			case "week": {
				const weekDays = calendarUtils.getWeekDays(currentDate);
				const start = weekDays[0];
				const end = weekDays[6];
				return `${start.getDate()}-${end.getDate()} ${monthNames[start.getMonth()]} ${start.getFullYear()}`;
			}
			case "day":
				return `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
		}
	};

	const handleDateClick = (date: Date) => {
		if (!mockEvents.find((e) => e.date === date.getDate())) {
			setSelectedDate(date);
			setTaskDialogOpen(true);
		}
	};

	const handleTimeSlotClick = (date: Date, hour: number) => {
		setSelectedDate(
			new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour),
		);
		setTaskDialogOpen(true);
	};

	const handleTaskClick = (
		e: React.MouseEvent | React.KeyboardEvent,
		task: Event,
	) => {
		e.stopPropagation();
		setSelectedTask(task);
		setTaskDetailsDialogOpen(true);
	};

	return (
		<div className="p-4 pb-24 space-y-4">
			<CalendarHeader
				viewType={viewType}
				dateTitle={getDateTitle()}
				onNavigate={handleNavigate}
				onViewTypeChange={setViewType}
				onAIDialogOpen={() => setAiDialogOpen(true)}
				onTaskDialogOpen={() => {
					setSelectedDate(new Date());
					setTaskDialogOpen(true);
				}}
			/>

			{/* Calendar Views */}
			{viewType === "month" && (
				<MonthView
					currentDate={currentDate}
					events={mockEvents}
					onDateClick={handleDateClick}
					onTaskClick={handleTaskClick}
				/>
			)}
			{viewType === "week" && (
				<WeekView
					currentDate={currentDate}
					onTimeSlotClick={handleTimeSlotClick}
					onTaskClick={handleTaskClick}
				/>
			)}
			{viewType === "day" && (
				<DayView
					currentDate={currentDate}
					onTimeSlotClick={handleTimeSlotClick}
					onTaskClick={handleTaskClick}
				/>
			)}

			<AIDialog open={aiDialogOpen} onOpenChange={setAiDialogOpen} />

			<TaskDialog
				open={taskDialogOpen}
				onOpenChange={setTaskDialogOpen}
				selectedDate={selectedDate}
			/>
			<TaskDetailsDialog
				open={taskDetailsDialogOpen}
				onOpenChange={setTaskDetailsDialogOpen}
				selectedTask={selectedTask}
			/>
		</div>
	);
}
