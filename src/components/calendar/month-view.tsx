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
		<div className="bg-card rounded-lg border border-border">
			{/* Header */}
			<div className="grid grid-cols-7 border-b border-border">
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
			<div className="grid grid-cols-7">
				{days.map((dayObj) => {
					const event = events.find(
						(e) => e.date === dayObj.day && dayObj.isCurrentMonth,
					);
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
							className={`min-h-[60px]  md:min-h-[100px] p-1 border-r border-b border-border last:border-r-0 cursor-pointer hover:bg-muted/10 w-full flex items-start justify-start gap-2 bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${
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
								className={`text-xs font-medium mb-1 ${
									!dayObj.isCurrentMonth
										? "text-muted-foreground"
										: isToday
											? "bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center"
											: ""
								}`}
							>
								{dayObj.day}
							</div>
							{event && (
								<button
									type="button"
									className={`text-xs p-1 rounded text-white mb-1 cursor-pointer hover:opacity-80 border-none outline-none focus:ring-2 focus:ring-white/30 truncate ${
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
									{event.title}
								</button>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
};
