import { Clock, MapPin, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useCalendar } from "@/hooks/use-calendar";
import type { Event } from "@/types/calendar";

interface EventDetailsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedEvent: Event | null;
}

export const EventDetailsDialog = ({
	open,
	onOpenChange,
	selectedEvent,
}: EventDetailsDialogProps) => {
	const { deleteEvent } = useCalendar();

	const handleDeleteEvent = async (eventId: string) => {
		try {
			await deleteEvent(eventId);
			onOpenChange(false);
		} catch (error: unknown) {
			console.error("Erro ao deletar evento:", error);
			toast.error("Erro ao deletar evento. Tente novamente.");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="sm:max-w-[425px]"
				aria-describedby="event details dialog"
			>
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						{selectedEvent?.title}
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Clock className="h-4 w-4" />
						{selectedEvent?.startDate && selectedEvent?.endDate
							? `${new Date(selectedEvent.startDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} - ${new Date(selectedEvent.endDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
							: "Dia todo"}
					</div>
					{selectedEvent?.type === "meeting" && (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<MapPin className="h-4 w-4" />
							Microsoft Teams Meeting
						</div>
					)}
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<User className="h-4 w-4" />
						Você
					</div>
					{selectedEvent?.content && (
						<div className="space-y-2">
							<span className="text-sm font-medium">Descrição</span>
							<p className="text-sm text-muted-foreground">
								{selectedEvent.content}
							</p>
						</div>
					)}
				</div>
				<DialogFooter>
					<Button variant="outline">Editar</Button>
					<Button
						onClick={() =>
							selectedEvent?.id && handleDeleteEvent(selectedEvent.id)
						}
						variant="destructive"
					>
						Excluir
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
