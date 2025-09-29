import type { Event } from "@/types/calendar";
import { calendarUtils } from "@/utils/calendarUtils";

interface DayViewProps {
	currentDate: Date;
	events: Event[];
	onTimeSlotClick: (date: Date, hour: number) => void;
	onEventClick: (
		e: React.MouseEvent | React.KeyboardEvent,
		event: Event,
	) => void;
}

export const DayView = ({
	currentDate,
	events,
	onTimeSlotClick,
	onEventClick,
}: DayViewProps) => {
	const hours = Array.from({ length: 24 }, (_, i) => i);

	return (
		<div className="bg-card rounded-lg border border-border h-full flex flex-col overflow-hidden ">
			<div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent">
				{hours.map((hour) => (
					<div key={hour} className="flex border-b border-border h-12">
						<div className="p-3 text-sm text-muted-foreground border-r border-border w-20">
							{calendarUtils.formatHour(hour)}
						</div>
						<button
							type="button"
							className="relative cursor-pointer hover:bg-muted/10 w-full bg-transparent outline-none focus:ring-2 focus:ring-primary/20"
							onClick={() => onTimeSlotClick(currentDate, hour)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onTimeSlotClick(currentDate, hour);
								}
							}}
						>
							{/* Events for this hour */}
							{/* TODO: check this */}
							{events
								.filter((event) => {
									const eventDate = new Date(event.startDate);
									return (
										eventDate.getDate() === currentDate.getDate() &&
										eventDate.getMonth() === currentDate.getMonth() &&
										eventDate.getFullYear() === currentDate.getFullYear() &&
										eventDate.getHours() === hour
									);
								})
								.map((event) => {
									const startTime = new Date(event.startDate);
									const endTime = new Date(event.endDate);
									const startHour = startTime
										.getHours()
										.toString()
										.padStart(2, "0");
									const startMinute = startTime
										.getMinutes()
										.toString()
										.padStart(2, "0");
									const endHour = endTime
										.getHours()
										.toString()
										.padStart(2, "0");
									const endMinute = endTime
										.getMinutes()
										.toString()
										.padStart(2, "0");

									return (
										<button
											key={event.id}
											type="button"
											className={`flex items-start justify-start inset-2 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent rounded text-sm text-white p-2 cursor-pointer hover:opacity-80 outline-none focus:ring-2 focus:ring-white/30 ${
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
											<div className="font-medium">{event.title}</div>
											<div className="opacity-80">
												{startHour}:{startMinute} - {endHour}:{endMinute}
											</div>
										</button>
									);
								})}
						</button>
					</div>
				))}
			</div>
		</div>
	);
};
