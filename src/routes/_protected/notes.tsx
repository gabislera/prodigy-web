import { createFileRoute } from "@tanstack/react-router";
import { NotesPage } from "@/pages/notes-page";

export const Route = createFileRoute("/_protected/notes")({
	component: NotesPage,
});
