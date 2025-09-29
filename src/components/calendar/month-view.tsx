import type { Event } from "@/types/calendar";
import { calendarUtils, dayNames } from "@/utils/calendarUtils";

interface MonthViewProps {
	currentDate: Date;
	events: Event[];
	onDateClick: (date: Date) => void;
	onEventClick: (
		e: React.MouseEvent | React.KeyboardEvent,
		event: Event,
	) => void;
}

export const MonthView = ({
	currentDate,
	events,
	onDateClick,
	onEventClick,
}: MonthViewProps) => {
	const days = calendarUtils.getDaysInMonth(currentDate);

	return (
		<div className="bg-card rounded-lg border border-border h-full flex flex-col overflow-hidden">
			{/* Header */}
			<div className="grid grid-cols-7 border-b border-border flex-shrink-0">
				{dayNames.map((day) => (
					<div
						key={day}
						className="p-2 text-center text-xs font-medium text-muted-foreground border-r border-border last:border-r-0"
					>
						{day}
					</div>
				))}
			</div>

			{/* Calendar Grid */}
			<div
				className="grid grid-cols-7 flex-1 min-h-0 overflow-hidden"
				style={{ gridTemplateRows: "repeat(6, minmax(0, 1fr))" }}
			>
				{days.map((dayObj) => {
					const dayEvents = events.filter((e) => {
						const eventDate = new Date(e.startDate);
						return (
							eventDate.getDate() === dayObj.day &&
							eventDate.getMonth() === currentDate.getMonth() &&
							eventDate.getFullYear() === currentDate.getFullYear() &&
							dayObj.isCurrentMonth
						);
					});
					const isToday =
						calendarUtils.isToday(
							dayObj.day,
							currentDate.getMonth(),
							currentDate.getFullYear(),
						) && dayObj.isCurrentMonth;

					return (
						<button
							key={`${currentDate.getFullYear()}-${currentDate.getMonth()}-${dayObj.day}-${dayObj.isCurrentMonth}`}
							type="button"
							className={`h-full min-h-0 p-1 border-r border-b  border-border last:border-r-0 cursor-pointer hover:bg-muted/10 w-full flex flex-col items-start justify-start bg-transparent outline-none focus:ring-2 focus:ring-primary/20 overflow-hidden ${
								!dayObj.isCurrentMonth ? "bg-muted/20" : ""
							}`}
							onClick={() =>
								onDateClick(
									new Date(
										currentDate.getFullYear(),
										currentDate.getMonth(),
										dayObj.day,
									),
								)
							}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onDateClick(
										new Date(
											currentDate.getFullYear(),
											currentDate.getMonth(),
											dayObj.day,
										),
									);
								}
							}}
						>
							<div
								className={`text-xs font-medium mb-1 flex-shrink-0 ${
									!dayObj.isCurrentMonth
										? "text-muted-foreground"
										: isToday
											? "bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center"
											: ""
								}`}
							>
								{dayObj.day}
							</div>
							<div className="flex flex-col gap-1 w-full flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent">
								{dayEvents.map((event) => (
									<button
										key={event.id}
										type="button"
										className={`text-xs text-start p-1 rounded text-white cursor-pointer hover:opacity-80 border-none outline-none focus:ring-2 focus:ring-white/30 truncate w-full flex-shrink-0 ${
											event.type === "holiday"
												? "bg-success"
												: event.type === "meeting"
													? "bg-accent"
													: "bg-primary"
										}`}
										onClick={(e) => onEventClick(e, event)}
									>
										{event.title}
									</button>
								))}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
};
