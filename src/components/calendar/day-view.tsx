import type { Event } from "@/types/calendar";
import { calendarUtils } from "@/utils/calendarUtils";

interface DayViewProps {
	currentDate: Date;
	onTimeSlotClick: (date: Date, hour: number) => void;
	onEventClick: (
		e: React.MouseEvent | React.KeyboardEvent,
		event: Event,
	) => void;
}

export const DayView = ({
	currentDate,
	onTimeSlotClick,
	onEventClick,
}: DayViewProps) => {
	const hours = Array.from({ length: 24 }, (_, i) => i);

	return (
		<div className="bg-card rounded-lg border border-border">
			<div className="overflow-y-auto">
				{hours.map((hour) => (
					<div key={hour} className="flex border-b border-border min-h-[60px]">
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
							{/* Mock events for today */}
							{hour === 13 && (
								<button
									type="button"
									className="absolute inset-2 bg-accent rounded text-sm text-white p-2 cursor-pointer hover:opacity-80 outline-none focus:ring-2 focus:ring-white/30"
									onClick={(e) => {
										const startDate = new Date(currentDate);
										startDate.setHours(13, 0, 0, 0);
										const endDate = new Date(currentDate);
										endDate.setHours(14, 0, 0, 0);
										onEventClick(e, {
											id: 2,
											title: "CSG Video Interview",
											date: currentDate,
											startDate: startDate,
											endDate: endDate,
											type: "meeting",
										});
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											const startDate = new Date(currentDate);
											startDate.setHours(13, 0, 0, 0);
											const endDate = new Date(currentDate);
											endDate.setHours(14, 0, 0, 0);
											onEventClick(e, {
												id: 2,
												title: "CSG Video Interview",
												date: currentDate,
												startDate: startDate,
												endDate: endDate,
												type: "meeting",
											});
										}
									}}
								>
									<div className="font-medium">CSG Video Interview</div>
									<div className="opacity-80">
										13:00 - 14:00, Microsoft Teams Meeting
									</div>
								</button>
							)}
						</button>
					</div>
				))}
			</div>
		</div>
	);
};
