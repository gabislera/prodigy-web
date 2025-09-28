import { Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
}: EventDetailsDialogProps) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle className="flex items-center justify-between">
					{selectedEvent?.title}
				</DialogTitle>
			</DialogHeader>
			<div className="space-y-4 py-4">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Clock className="h-4 w-4" />
					{selectedEvent?.startDate && selectedEvent?.endDate
						? `${selectedEvent.startDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} - ${selectedEvent.endDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
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
				{selectedEvent?.description && (
					<div className="space-y-2">
						<span className="text-sm font-medium">Descrição</span>
						<p className="text-sm text-muted-foreground">
							{selectedEvent.description}
						</p>
					</div>
				)}
			</div>
			<DialogFooter>
				<Button variant="outline">Editar</Button>
				<Button variant="destructive">Excluir</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
