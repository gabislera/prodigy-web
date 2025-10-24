"use client";

import { RiCalendarCheckLine } from "@remixicon/react";
import {
	addDays,
	addMonths,
	addWeeks,
	endOfWeek,
	format,
	isSameMonth,
	startOfWeek,
	subMonths,
	subWeeks,
} from "date-fns";
import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	PanelRightCloseIcon,
	PanelRightOpenIcon,
	PlusIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
	AgendaDaysToShow,
	AgendaView,
	CalendarDndProvider,
	type CalendarEvent,
	type CalendarView,
	DayView,
	EventGap,
	EventHeight,
	MonthView,
	WeekCellsHeight,
	WeekView,
} from "@/components/event-calendar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dateFnsLocale } from "@/lib/date-fns-locale";
import { cn } from "@/lib/utils";

export interface EventCalendarProps {
	events?: CalendarEvent[];
	onEventSelect?: (event: CalendarEvent) => void;
	onEventCreate?: (startTime: Date) => void;
	onEventUpdate?: (event: CalendarEvent) => void;
	onExternalDrop?: (date: Date, time?: number) => void;
	onSidebarToggle?: () => void;
	isSidebarOpen?: boolean;
	className?: string;
	initialView?: CalendarView;
}

export function EventCalendar({
	events = [],
	onEventSelect,
	onEventCreate,
	onEventUpdate,
	onExternalDrop,
	onSidebarToggle,
	isSidebarOpen = false,
	className,
	initialView = "month",
}: EventCalendarProps) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [view, setView] = useState<CalendarView>(initialView);

	const handlePrevious = () => {
		if (view === "month") {
			setCurrentDate(subMonths(currentDate, 1));
		} else if (view === "week") {
			setCurrentDate(subWeeks(currentDate, 1));
		} else if (view === "day") {
			setCurrentDate(addDays(currentDate, -1));
		} else if (view === "agenda") {
			// For agenda view, go back 30 days (a full month)
			setCurrentDate(addDays(currentDate, -AgendaDaysToShow));
		}
	};

	const handleNext = () => {
		if (view === "month") {
			setCurrentDate(addMonths(currentDate, 1));
		} else if (view === "week") {
			setCurrentDate(addWeeks(currentDate, 1));
		} else if (view === "day") {
			setCurrentDate(addDays(currentDate, 1));
		} else if (view === "agenda") {
			// For agenda view, go forward 30 days (a full month)
			setCurrentDate(addDays(currentDate, AgendaDaysToShow));
		}
	};

	const handleToday = () => {
		setCurrentDate(new Date());
	};

	const handleEventSelect = (event: CalendarEvent) => {
		onEventSelect?.(event);
	};

	const handleEventCreate = (startTime: Date) => {
		onEventCreate?.(startTime);
	};

	const handleEventUpdate = (event: CalendarEvent) => {
		onEventUpdate?.(event);
	};

	const viewTitle = useMemo(() => {
		if (view === "month") {
			return format(currentDate, "MMMM yyyy", { locale: dateFnsLocale });
		} else if (view === "week") {
			const start = startOfWeek(currentDate, { weekStartsOn: 0 });
			const end = endOfWeek(currentDate, { weekStartsOn: 0 });
			if (isSameMonth(start, end)) {
				return format(start, "MMMM yyyy", { locale: dateFnsLocale });
			} else {
				return `${format(start, "MMM", { locale: dateFnsLocale })} - ${format(end, "MMM yyyy", { locale: dateFnsLocale })}`;
			}
		} else if (view === "day") {
			return (
				<>
					<span className="min-[480px]:hidden" aria-hidden="true">
						{format(currentDate, "MMM d, yyyy", { locale: dateFnsLocale })}
					</span>
					<span className="max-[479px]:hidden min-md:hidden" aria-hidden="true">
						{format(currentDate, "MMMM d, yyyy", { locale: dateFnsLocale })}
					</span>
					<span className="max-md:hidden">
						{format(currentDate, "EEE MMMM d, yyyy", { locale: dateFnsLocale })}
					</span>
				</>
			);
		} else if (view === "agenda") {
			// Show the month range for agenda view
			const start = currentDate;
			const end = addDays(currentDate, AgendaDaysToShow - 1);

			if (isSameMonth(start, end)) {
				return format(start, "MMMM yyyy", { locale: dateFnsLocale });
			} else {
				return `${format(start, "MMM", { locale: dateFnsLocale })} - ${format(end, "MMM yyyy", { locale: dateFnsLocale })}`;
			}
		} else {
			return format(currentDate, "MMMM yyyy", { locale: dateFnsLocale });
		}
	}, [currentDate, view]);

	return (
		<div
			className="flex flex-1 flex-col rounded-lg border min-h-0"
			style={
				{
					"--event-height": `${EventHeight}px`,
					"--event-gap": `${EventGap}px`,
					"--week-cells-height": `${WeekCellsHeight}px`,
				} as React.CSSProperties
			}
		>
			<CalendarDndProvider onEventUpdate={handleEventUpdate}>
				<div
					className={cn(
						"flex items-center justify-between p-2 sm:p-4",
						className,
					)}
				>
					<div className="flex items-center gap-1 sm:gap-4">
						<Button
							variant="outline"
							className="max-[479px]:aspect-square max-[479px]:p-0!"
							onClick={handleToday}
						>
							<RiCalendarCheckLine
								className="min-[480px]:hidden"
								size={16}
								aria-hidden="true"
							/>
							<span className="max-[479px]:sr-only">Hoje</span>
						</Button>
						<div className="flex items-center sm:gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={handlePrevious}
								aria-label="Previous"
							>
								<ChevronLeftIcon size={16} aria-hidden="true" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleNext}
								aria-label="Next"
							>
								<ChevronRightIcon size={16} aria-hidden="true" />
							</Button>
						</div>
						<h2 className="text-sm font-semibold sm:text-lg md:text-xl">
							{viewTitle}
						</h2>
					</div>
					<div className="flex items-center gap-2">
						{onSidebarToggle && (
							<Button
								variant="outline"
								size="icon"
								onClick={onSidebarToggle}
								aria-label={isSidebarOpen ? "Fechar sidebar" : "Abrir sidebar"}
								className="max-[479px]:h-8 max-[479px]:w-8"
							>
								{isSidebarOpen ? (
									<PanelRightCloseIcon size={16} aria-hidden="true" />
								) : (
									<PanelRightOpenIcon size={16} aria-hidden="true" />
								)}
							</Button>
						)}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="gap-1.5 max-[479px]:h-8">
									<span>
										<span className="min-[480px]:hidden" aria-hidden="true">
											{view.charAt(0).toUpperCase()}
										</span>
										<span className="max-[479px]:sr-only">
											{view.charAt(0).toUpperCase() + view.slice(1)}
										</span>
									</span>
									<ChevronDownIcon
										className="-me-1 opacity-60"
										size={16}
										aria-hidden="true"
									/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="min-w-32">
								<DropdownMenuItem onClick={() => setView("month")}>
									Mês
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setView("week")}>
									Semana
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setView("day")}>
									Dia
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setView("agenda")}>
									Agenda
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<Button
							className="max-[479px]:aspect-square max-[479px]:p-0!"
							size="sm"
							onClick={() => handleEventCreate(new Date())}
						>
							<PlusIcon
								className="opacity-60 sm:-ms-1"
								size={16}
								aria-hidden="true"
							/>
							<span className="max-sm:sr-only">Novo evento</span>
						</Button>
					</div>
				</div>

				<div className="flex flex-1 flex-col min-h-0">
					{view === "month" && (
						<MonthView
							currentDate={currentDate}
							events={events}
							onEventSelect={handleEventSelect}
							onEventCreate={handleEventCreate}
							onExternalDrop={onExternalDrop}
						/>
					)}
					{view === "week" && (
						<WeekView
							currentDate={currentDate}
							events={events}
							onEventSelect={handleEventSelect}
							onEventCreate={handleEventCreate}
							onExternalDrop={onExternalDrop}
						/>
					)}
					{view === "day" && (
						<DayView
							currentDate={currentDate}
							events={events}
							onEventSelect={handleEventSelect}
							onEventCreate={handleEventCreate}
							onExternalDrop={onExternalDrop}
						/>
					)}
					{view === "agenda" && (
						<AgendaView
							currentDate={currentDate}
							events={events}
							onEventSelect={handleEventSelect}
						/>
					)}
				</div>
			</CalendarDndProvider>
		</div>
	);
}
