import { createFileRoute } from "@tanstack/react-router";
import { TimerPage } from "@/pages/timer-page";

export const Route = createFileRoute("/_protected/timer")({
	component: TimerPage,
});
