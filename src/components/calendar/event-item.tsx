"use client";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { differenceInMinutes, format, getMinutes } from "date-fns";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { dateFnsLocale } from "@/utils/date-helpers";
import {
	type CalendarEvent,
	getBorderRadiusClasses,
	getEventColorClasses,
} from ".";

// Using date-fns format with custom formatting:
// 'h' - hours (1-12)
// 'a' - am/pm
// ':mm' - minutes with leading zero (only if the token 'mm' is present)
const formatTimeWithOptionalMinutes = (date: Date) => {
	return format(date, getMinutes(date) === 0 ? "ha" : "h:mma", {
		locale: dateFnsLocale,
	}).toLowerCase();
};

interface EventWrapperProps {
	event: CalendarEvent;
	isFirstDay?: boolean;
	isLastDay?: boolean;
	isDragging?: boolean;
	onClick?: (e: React.MouseEvent) => void;
	className?: string;
	children: React.ReactNode;
	dndListeners?: SyntheticListenerMap;
	dndAttributes?: DraggableAttributes;
	onMouseDown?: (e: React.MouseEvent) => void;
	onTouchStart?: (e: React.TouchEvent) => void;
}

// Shared wrapper component for event styling
function EventWrapper({
	event,
	isFirstDay = true,
	isLastDay = true,
	isDragging,
	onClick,
	className,
	children,
	dndListeners,
	dndAttributes,
	onMouseDown,
	onTouchStart,
}: EventWrapperProps) {
	// Check if the event is completed
	const isEventCompleted = event.completed || false;

	return (
		<button
			className={cn(
				"flex size-full overflow-hidden px-1 text-left font-medium backdrop-blur-md transition outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-dragging:cursor-grabbing data-dragging:shadow-lg data-past-event:line-through sm:px-2",
				getEventColorClasses(event.priority),
				getBorderRadiusClasses(isFirstDay, isLastDay),
				className,
			)}
			data-dragging={isDragging || undefined}
			data-past-event={isEventCompleted || undefined}
			onClick={onClick}
			onMouseDown={onMouseDown}
			onTouchStart={onTouchStart}
			{...dndListeners}
			{...dndAttributes}
		>
			{children}
		</button>
	);
}

interface EventItemProps {
	event: CalendarEvent;
	view: "month" | "week" | "day" | "agenda";
	isDragging?: boolean;
	onClick?: (e: React.MouseEvent) => void;
	showTime?: boolean;
	currentTime?: Date; // For updating time during drag
	isFirstDay?: boolean;
	isLastDay?: boolean;
	children?: React.ReactNode;
	className?: string;
	dndListeners?: SyntheticListenerMap;
	dndAttributes?: DraggableAttributes;
	onMouseDown?: (e: React.MouseEvent) => void;
	onTouchStart?: (e: React.TouchEvent) => void;
}

export function EventItem({
	event,
	view,
	isDragging,
	onClick,
	showTime,
	currentTime,
	isFirstDay = true,
	isLastDay = true,
	children,
	className,
	dndListeners,
	dndAttributes,
	onMouseDown,
	onTouchStart,
}: EventItemProps) {

	// Use the provided currentTime (for dragging) or the event's actual time
	const displayStart = useMemo(() => {
		return currentTime || new Date(event.startDate);
	}, [currentTime, event.startDate]);

	const displayEnd = useMemo(() => {
		if (currentTime && event.startDate && event.endDate) {
			return new Date(
				new Date(currentTime).getTime() +
					(new Date(event.endDate).getTime() -
						new Date(event.startDate).getTime()),
			);
		}
		return new Date(event.endDate);
	}, [currentTime, event.startDate, event.endDate]);

	// Calculate event duration in minutes
	const durationMinutes = useMemo(() => {
		return differenceInMinutes(displayEnd, displayStart);
	}, [displayStart, displayEnd]);

	const getEventTime = () => {
		if (event.allDay) return "All day";

		// For short events (less than 45 minutes), only show start time
		if (durationMinutes < 45) {
			return formatTimeWithOptionalMinutes(displayStart);
		}

		// For longer events, show both start and end time
		return `${formatTimeWithOptionalMinutes(displayStart)} - ${formatTimeWithOptionalMinutes(displayEnd)}`;
	};

	if (view === "month") {
		return (
			<EventWrapper
				event={event}
				isFirstDay={isFirstDay}
				isLastDay={isLastDay}
				isDragging={isDragging}
				onClick={onClick}
				className={cn(
					"mt-[var(--event-gap)] h-[var(--event-height)] items-center text-[10px] sm:text-xs",
					className,
				)}
				dndListeners={dndListeners}
				dndAttributes={dndAttributes}
				onMouseDown={onMouseDown}
				onTouchStart={onTouchStart}
			>
				{children || (
					<span className="truncate">
						{!event.allDay && (
							<span className="truncate font-normal opacity-70 sm:text-[11px]">
								{formatTimeWithOptionalMinutes(displayStart)}{" "}
							</span>
						)}
						{event.title}
					</span>
				)}
			</EventWrapper>
		);
	}

	if (view === "week" || view === "day") {
		return (
			<EventWrapper
				event={event}
				isFirstDay={isFirstDay}
				isLastDay={isLastDay}
				isDragging={isDragging}
				onClick={onClick}
				className={cn(
					"py-1",
					durationMinutes < 45 ? "items-center" : "flex-col",
					view === "week" ? "text-[10px] sm:text-xs" : "text-xs",
					className,
				)}
				dndListeners={dndListeners}
				dndAttributes={dndAttributes}
				onMouseDown={onMouseDown}
				onTouchStart={onTouchStart}
			>
				{durationMinutes < 45 ? (
					<div className="truncate">
						{event.title}{" "}
						{showTime && (
							<span className="opacity-70">
								{formatTimeWithOptionalMinutes(displayStart)}
							</span>
						)}
					</div>
				) : (
					<>
						<div className="truncate font-medium">{event.title}</div>
						{showTime && (
							<div className="truncate font-normal opacity-70 sm:text-[11px]">
								{getEventTime()}
							</div>
						)}
					</>
				)}
			</EventWrapper>
		);
	}

	// Agenda view - kept separate since it's significantly different
	return (
		<button
			className={cn(
				"flex w-full flex-col gap-1 rounded p-2 text-left transition outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-past-event:line-through data-past-event:opacity-90",
				getEventColorClasses(event.priority),
				className,
			)}
			data-past-event={event.completed || undefined}
			onClick={onClick}
			onMouseDown={onMouseDown}
			onTouchStart={onTouchStart}
			{...dndListeners}
			{...dndAttributes}
		>
			<div className="text-sm font-medium">{event.title}</div>
			<div className="text-xs opacity-70">
				{event.allDay ? (
					<span>All day</span>
				) : (
					<span className="uppercase">
						{formatTimeWithOptionalMinutes(displayStart)} -{" "}
						{formatTimeWithOptionalMinutes(displayEnd)}
					</span>
				)}
			</div>
			{event.description && (
				<div className="my-1 text-xs opacity-90">{event.description}</div>
			)}
		</button>
	);
}
