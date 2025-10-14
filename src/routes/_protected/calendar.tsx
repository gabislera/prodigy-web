import { createFileRoute } from "@tanstack/react-router";
import { CalendarPage } from "@/pages/calendar-page";

export const Route = createFileRoute("/_protected/calendar")({
	component: CalendarPage,
});
