import type { Event } from "@/types/calendar";
import { calendarUtils, weekDayNames } from "@/utils/calendarUtils";

interface WeekViewProps {
	currentDate: Date;
	events: Event[];
	onTimeSlotClick: (date: Date, hour: number) => void;
	onEventClick: (
		e: React.MouseEvent | React.KeyboardEvent,
		event: Event,
	) => void;
}

export const WeekView = ({
	currentDate,
	events,
	onTimeSlotClick,
	onEventClick,
}: WeekViewProps) => {
	const weekDays = calendarUtils.getWeekDays(currentDate);
	const hours = Array.from({ length: 24 }, (_, i) => i);

	return (
		<div className="bg-card rounded-lg border border-border h-full flex flex-col overflow-hidden">
			{/* Week Header */}
			<div
				className="grid border-b border-border flex-shrink-0"
				style={{ gridTemplateColumns: "4rem 1fr 1fr 1fr 1fr 1fr 1fr 1fr" }}
			>
				<div className="p-2 text-xs font-medium text-muted-foreground border-r border-border"></div>
				{weekDays.map((day, index) => {
					const isToday = day.toDateString() === new Date().toDateString();
					return (
						<div
							key={`week-${day.toISOString()}-${index}`}
							className="p-2 text-center border-r border-border last:border-r-0"
						>
							<div className="text-xs text-muted-foreground">
								{weekDayNames[index]}
							</div>
							<div
								className={`text-sm md:text-lg font-bold ${
									isToday ? "text-primary font-bold" : ""
								}`}
							>
								{day.getDate()}
							</div>
						</div>
					);
				})}
			</div>

			{/* Time Grid */}
			<div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent">
				{hours.map((hour) => (
					<div
						key={hour}
						className="grid border-b border-border"
						style={{ gridTemplateColumns: "4rem 1fr 1fr 1fr 1fr 1fr 1fr 1fr" }}
					>
						<div className="p-2 text-xs text-muted-foreground border-r border-border">
							{calendarUtils.formatHour(hour)}
						</div>
						{weekDays.map((day) => (
							<button
								key={`timeslot-${day.toISOString()}-${hour}`}
								type="button"
								className="h-12 pb-2 flex flex-col gap-1 items-start justify-start truncate border-r border-border last:border-r-0 cursor-pointer hover:bg-muted/10 w-full bg-transparent outline-none focus:ring-2 focus:ring-primary/20"
								onClick={() => onTimeSlotClick(day, hour)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										onTimeSlotClick(day, hour);
									}
								}}
							>
								{/* Events for this day and hour */}
								{/* TODO: check this */}
								{events
									.filter((event) => {
										const eventDate = new Date(event.startDate);
										return (
											eventDate.getDate() === day.getDate() &&
											eventDate.getMonth() === day.getMonth() &&
											eventDate.getFullYear() === day.getFullYear() &&
											eventDate.getHours() === hour
										);
									})
									.map((event) => (
										<button
											key={event.id}
											type="button"
											className={`bg-accent text-start rounded w-full text-xs text-white p-1 cursor-pointer hover:opacity-80 outline-none focus:ring-2 focus:ring-white/30 truncate ${
												event.type === "holiday"
													? "bg-success"
													: event.type === "meeting"
														? "bg-accent"
														: "bg-primary"
											}`}
											onClick={(e) => onEventClick(e, event)}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													onEventClick(e, event);
												}
											}}
										>
											<div className="font-medium truncate">{event.title}</div>
										</button>
									))}
							</button>
						))}
					</div>
				))}
			</div>
		</div>
	);
};
