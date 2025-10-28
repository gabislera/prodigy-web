import { createFileRoute } from "@tanstack/react-router";
import { TasksPage } from "@/pages/tasks-page";

export const Route = createFileRoute("/_protected/tasks/$groupId")({
	component: TasksPage,
});
