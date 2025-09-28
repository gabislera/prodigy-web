import { calendarUtils, weekDayNames } from "@/services/calendarService";
import type { Event } from "@/types/calendar";

interface WeekViewProps {
	currentDate: Date;
	onTimeSlotClick: (date: Date, hour: number) => void;
	onTaskClick: (e: React.MouseEvent | React.KeyboardEvent, task: Event) => void;
}

export const WeekView = ({
	currentDate,
	onTimeSlotClick,
	onTaskClick,
}: WeekViewProps) => {
	const weekDays = calendarUtils.getWeekDays(currentDate);
	const hours = Array.from({ length: 24 }, (_, i) => i);

	return (
		<div className="bg-card rounded-lg border border-border">
			{/* Week Header */}
			<div
				className="grid border-b border-border"
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
			<div className=" overflow-y-auto">
				{hours.map((hour) => (
					<div
						key={hour}
						className="grid border-b border-border"
						style={{ gridTemplateColumns: "4rem 1fr 1fr 1fr 1fr 1fr 1fr 1fr" }}
					>
						<div className="p-2 text-xs text-muted-foreground border-r border-border">
							{calendarUtils.formatHour(hour)}
						</div>
						{weekDays.map((day, dayIndex) => (
							<button
								key={`timeslot-${day.toISOString()}-${hour}`}
								type="button"
								className="min-h-[50px] truncate border-r border-border last:border-r-0 relative cursor-pointer hover:bg-muted/10 w-full bg-transparent outline-none focus:ring-2 focus:ring-primary/20"
								onClick={() => onTimeSlotClick(day, hour)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										onTimeSlotClick(day, hour);
									}
								}}
							>
								{/* Mock events */}
								{hour === 13 && dayIndex === 3 && (
									<button
										type="button"
										className="absolute bg-accent rounded text-xs text-white p-1 cursor-pointer hover:opacity-80 outline-none focus:ring-2 focus:ring-white/30 truncate"
										onClick={(e) =>
											onTaskClick(e, {
												id: 2,
												title: "CSG Video Interview",
												date: day,
												time: "1pm",
												type: "meeting",
											})
										}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												onTaskClick(e, {
													id: 2,
													title: "CSG Video Interview",
													date: day,
													time: "1pm",
													type: "meeting",
												});
											}
										}}
									>
										<div className="font-medium truncate">
											CSG Video Interview
										</div>
									</button>
								)}
							</button>
						))}
					</div>
				))}
			</div>
		</div>
	);
};
