import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DateSelectorProps {
	children?: React.ReactNode;
	onSelectDate?: (
		date: Date | null,
		startTime: string,
		endTime: string,
	) => void;
	initialDate?: Date | null;
	initialStartTime?: string;
	initialEndTime?: string;
	selectedDate?: Date | null;
	onClearDate?: () => void;
}

// Helper to format date to time string (HH:mm)
const formatTimeFromDate = (date: Date): string => {
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${hours}:${minutes}`;
};

// Helper to get default times
const getDefaultTimes = () => {
	const now = new Date();
	const later = new Date(now.getTime() + 30 * 60000); // +30 minutes
	return {
		start: formatTimeFromDate(now),
		end: formatTimeFromDate(later),
	};
};

export const DateSelector = ({
	children,
	onSelectDate,
	initialDate,
	initialStartTime,
	initialEndTime,
	selectedDate,
	onClearDate,
}: DateSelectorProps) => {
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState<Date | undefined>(initialDate || undefined);

	const defaultTimes = getDefaultTimes();

	const [startTime, setStartTime] = useState(
		initialStartTime ||
			(initialDate ? formatTimeFromDate(initialDate) : defaultTimes.start),
	);

	const [endTime, setEndTime] = useState(
		initialEndTime ||
			(initialDate ? formatTimeFromDate(initialDate) : defaultTimes.end),
	);

	// Update times when initialDate changes
	useEffect(() => {
		if (initialDate) {
			setDate(initialDate);
			if (initialStartTime) setStartTime(initialStartTime);
			if (initialEndTime) setEndTime(initialEndTime);
		}
	}, [initialDate, initialStartTime, initialEndTime]);

	// When popover opens and there's a selected date, automatically save it
	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);

		// When opening the popover, if there's a date selected or we select one, it should be saved
		if (isOpen && date && onSelectDate) {
			// Auto-select the date with current times
			const selectedDate = date || new Date();
			onSelectDate(selectedDate, startTime, endTime);
		}
	};

	const handleDateSelect = (selectedDate: Date | undefined) => {
		setDate(selectedDate);

		// Update the selected date but don't close the popover
		if (selectedDate && onSelectDate) {
			onSelectDate(selectedDate, startTime, endTime);
		}
	};

	const handleTimeChange = (type: "start" | "end", value: string) => {
		if (type === "start") {
			setStartTime(value);

			// If new start time is >= end time, auto-adjust end time
			const [startHours, startMinutes] = value.split(":").map(Number);
			const [endHours, endMinutes] = endTime.split(":").map(Number);

			const startTotalMinutes = startHours * 60 + startMinutes;
			const endTotalMinutes = endHours * 60 + endMinutes;

			if (startTotalMinutes >= endTotalMinutes) {
				const adjustedEndMinutes = startTotalMinutes + 30;
				const adjustedEndHours = Math.floor(adjustedEndMinutes / 60) % 24;
				const adjustedEndMins = adjustedEndMinutes % 60;
				const adjustedEndTime = `${adjustedEndHours.toString().padStart(2, "0")}:${adjustedEndMins.toString().padStart(2, "0")}`;

				setEndTime(adjustedEndTime);

				if (date && onSelectDate) {
					onSelectDate(date, value, adjustedEndTime);
				}
			} else {
				if (date && onSelectDate) {
					onSelectDate(date, value, endTime);
				}
			}
		} else {
			setEndTime(value);

			if (date && onSelectDate) {
				onSelectDate(date, startTime, value);
			}
		}
	};

	const handleClearDate = (e: React.MouseEvent) => {
		e.stopPropagation();
		setDate(undefined);
		onClearDate?.();
	};

	const inputClassName =
		"hide-picker focus:outline-none focus:ring-0 focus:border-border focus-visible:outline-none focus-visible:ring-0";

	const hasSelectedDate = selectedDate !== null && selectedDate !== undefined;

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<div className="relative w-full">
				<PopoverTrigger className="hover:text-white w-full" asChild>
					{children}
				</PopoverTrigger>
				{hasSelectedDate && (
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
						onClick={handleClearDate}
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>
			<PopoverContent className="w-auto p-0" align="start">
				<div className="flex flex-col items-center gap-4 p-4">
					<div className="relative">
						<Calendar
							mode="single"
							selected={date}
							onSelect={handleDateSelect}
							defaultMonth={date || new Date()}
							locale={ptBR}
							className="calendar-transparent"
						/>
					</div>

					<div className="flex gap-4 w-full">
						<div className="flex flex-col gap-2 flex-1">
							<Label htmlFor="start-time" className="text-xs font-medium">
								Hora Início
							</Label>
							<Input
								id="start-time"
								type="time"
								value={startTime}
								onChange={(e) => handleTimeChange("start", e.target.value)}
								className={inputClassName}
							/>
						</div>
						<div className="flex flex-col gap-2 flex-1">
							<Label htmlFor="end-time" className="text-xs font-medium">
								Hora Fim
							</Label>
							<Input
								id="end-time"
								type="time"
								value={endTime}
								onChange={(e) => handleTimeChange("end", e.target.value)}
								className={inputClassName}
							/>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
