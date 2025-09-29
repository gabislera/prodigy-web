import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
	AIDialog,
	CalendarHeader,
	DayView,
	EventDetailsDialog,
	EventDialog,
	MonthView,
	WeekView,
} from "@/components/calendar";
import { useCalendar } from "@/hooks/use-calendar";
import type { Event, ViewType } from "@/types/calendar";
import { calendarUtils, monthNames } from "@/utils/calendarUtils";

export const Route = createFileRoute("/_protected/calendar")({
	component: CalendarPage,
});

function CalendarPage() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [viewType, setViewType] = useState<ViewType>("month");
	const [aiDialogOpen, setAiDialogOpen] = useState(false);
	const [eventDialogOpen, setEventDialogOpen] = useState(false);
	const [eventDetailsDialogOpen, setEventDetailsDialogOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

	const { events } = useCalendar();

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
		setSelectedDate(date);
		setEventDialogOpen(true);
	};

	const handleTimeSlotClick = (date: Date, hour: number) => {
		setSelectedDate(
			new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour),
		);
		setEventDialogOpen(true);
	};

	const handleEventClick = (
		e: React.MouseEvent | React.KeyboardEvent,
		event: Event,
	) => {
		e.stopPropagation();
		setSelectedEvent(event);
		setEventDetailsDialogOpen(true);
	};

	return (
		<div
			className={`flex flex-col h-[calc(100vh-80px)] pb-20 md:h-[calc(100vh-80px)] md:p-4`}
		>
			<div className="flex-shrink-0 mb-4">
				<CalendarHeader
					viewType={viewType}
					dateTitle={getDateTitle()}
					onNavigate={handleNavigate}
					onViewTypeChange={setViewType}
					onAIDialogOpen={() => setAiDialogOpen(true)}
					onEventDialogOpen={() => {
						setSelectedDate(new Date());
						setEventDialogOpen(true);
					}}
				/>
			</div>

			{/* Calendar Views */}
			<div className="flex-1 min-h-0 overflow-hidden">
				{viewType === "month" && (
					<MonthView
						currentDate={currentDate}
						events={events}
						onDateClick={handleDateClick}
						onEventClick={handleEventClick}
					/>
				)}
				{viewType === "week" && (
					<WeekView
						currentDate={currentDate}
						onTimeSlotClick={handleTimeSlotClick}
						onEventClick={handleEventClick}
						events={events}
					/>
				)}
				{viewType === "day" && (
					<DayView
						currentDate={currentDate}
						events={events}
						onTimeSlotClick={handleTimeSlotClick}
						onEventClick={handleEventClick}
					/>
				)}
			</div>

			<AIDialog open={aiDialogOpen} onOpenChange={setAiDialogOpen} />

			<EventDialog
				open={eventDialogOpen}
				onOpenChange={setEventDialogOpen}
				selectedDate={selectedDate}
			/>
			<EventDetailsDialog
				open={eventDetailsDialogOpen}
				onOpenChange={setEventDetailsDialogOpen}
				selectedEvent={selectedEvent}
			/>
		</div>
	);
}
