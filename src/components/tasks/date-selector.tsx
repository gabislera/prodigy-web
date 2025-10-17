import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DateSelectorProps {
	children?: React.ReactNode;
	onSelectRange?: (range: DateRange | undefined) => void; // callback opcional
	initialRange?: DateRange;
	hasDate?: boolean;
	onDateToggle?: (enabled: boolean) => void;
	selectedEndDate?: Date | null;
}

// Helper to format date to time string (HH:mm)
const formatTimeFromDate = (date: Date): string => {
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${hours}:${minutes}`;
};

export const DateSelector = ({
	children,
	onSelectRange,
	initialRange,
	hasDate = false,
	onDateToggle,
	selectedEndDate: _selectedEndDate,
}: DateSelectorProps) => {
	const [open, setOpen] = useState(false);
	const [range, setRange] = useState<DateRange | undefined>(initialRange);

	// Calculate default times: current time and current time + 30min
	const getDefaultTimes = () => {
		const now = new Date();
		const later = new Date(now.getTime() + 30 * 60000); // +30 minutes
		return {
			start: formatTimeFromDate(now),
			end: formatTimeFromDate(later),
		};
	};

	const [startTime, setStartTime] = useState(() =>
		initialRange?.from
			? formatTimeFromDate(initialRange.from)
			: getDefaultTimes().start,
	);

	const [endTime, setEndTime] = useState(() =>
		initialRange?.to
			? formatTimeFromDate(initialRange.to)
			: getDefaultTimes().end,
	);

	// Update times when initialRange changes
	useEffect(() => {
		if (initialRange?.from) {
			setStartTime(formatTimeFromDate(initialRange.from));
		}
		if (initialRange?.to) {
			setEndTime(formatTimeFromDate(initialRange.to));
		}
	}, [initialRange]);

	// Helper to combine Date and time string (HH:mm) into a new Date
	const combineDateAndTime = (date: Date, time: string): Date => {
		const [hours, minutes] = time.split(":").map(Number);
		const newDate = new Date(date);
		newDate.setHours(hours, minutes, 0, 0);
		return newDate;
	};

	const handleConfirm = () => {
		if (!onSelectRange) {
			setOpen(false);
			return;
		}

		if (!hasDate) {
			// If switch is disabled, send undefined to save null
			onSelectRange(undefined);
			setOpen(false);
			return;
		}

		// Determine dates to use (selected or today)
		const startDate = range?.from || new Date();
		const endDate = range?.to || new Date();

		// Combine dates with times
		const rangeWithTime = {
			from: combineDateAndTime(startDate, startTime),
			to: combineDateAndTime(endDate, endTime),
		};

		onSelectRange(rangeWithTime);
		setOpen(false);
	};

	const handleDateToggle = (enabled: boolean) => {
		onDateToggle?.(enabled);

		if (!enabled) {
			setRange(undefined);
		}
	};

	const disabledClass = !hasDate ? "pointer-events-none opacity-50" : "";
	const inputClassName =
		"hide-picker focus:outline-none focus:ring-0 focus:border-border focus-visible:outline-none focus-visible:ring-0";

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger className="hover:text-white" asChild>
				{children}
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<div className="flex flex-col items-center gap-4 p-4">
					<div className="flex items-center space-x-2 w-full">
						<Checkbox
							id="task-date"
							checked={hasDate}
							onCheckedChange={handleDateToggle}
						/>
						<Label htmlFor="task-date" className="text-sm font-medium">
							Definir data e hora
						</Label>
					</div>

					<div className={`relative ${disabledClass}`}>
						<Calendar
							mode="range"
							selected={range}
							onSelect={hasDate ? setRange : undefined}
							numberOfMonths={1}
							defaultMonth={range?.from || new Date()}
							locale={ptBR}
							className="calendar-transparent"
						/>
					</div>

					<div className={`flex gap-4 w-full ${disabledClass}`}>
						<div className="flex flex-col gap-2 flex-1">
							<Label htmlFor="start-time" className="text-xs font-medium">
								Hora Início
							</Label>
							<Input
								id="start-time"
								type="time"
								value={startTime}
								onChange={(e) => setStartTime(e.target.value)}
								disabled={!hasDate}
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
								onChange={(e) => setEndTime(e.target.value)}
								disabled={!hasDate}
								className={inputClassName}
							/>
						</div>
					</div>

					<Button
						onClick={handleConfirm}
						className="mt-2 w-full bg-gradient-primary border-0"
					>
						Confirmar
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};
