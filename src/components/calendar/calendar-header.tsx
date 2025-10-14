import { ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ViewType } from "@/types/calendar";

interface CalendarHeaderProps {
	viewType: ViewType;
	dateTitle: string;
	onNavigate: (direction: "prev" | "next") => void;
	onViewTypeChange: (view: ViewType) => void;
	onAIDialogOpen: () => void;
	onEventDialogOpen: () => void;
}

export const CalendarHeader = ({
	viewType,
	dateTitle,
	onNavigate,
	onViewTypeChange,
	onAIDialogOpen,
	onEventDialogOpen,
}: CalendarHeaderProps) => {
	const isMobile = useIsMobile();
	const buttonVariant = isMobile ? "ghost" : "outline";
	return (
		<Card className="p-4 bg-gradient-card border-border/50 ">
			<div className="flex flex-col md:flex-row gap-y-4 items-start md:items-center justify-between">
				<div className="flex items-center gap-2 md:w-content">
					<Button
						variant="outline"
						size="icon"
						onClick={() => onNavigate("prev")}
						className="h-8 w-8"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<h1 className="text-lg font-semibold">{dateTitle}</h1>
					<Button
						variant="outline"
						size="icon"
						onClick={() => onNavigate("next")}
						className="h-8 w-8"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>

				<div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
					<div className="flex items-center bg-muted rounded-lg">
						{(["month", "week", "day"] as ViewType[]).map((view) => (
							<Button
								key={view}
								variant={viewType === view ? "default" : "ghost"}
								size="sm"
								onClick={() => onViewTypeChange(view)}
								className={`text-xs hover:bg-foreground/10! hover:text-white! ${viewType === view ? "bg-gradient-primary" : ""}`}
							>
								{view === "month" ? "Mês" : view === "week" ? "Semana" : "Dia"}
							</Button>
						))}
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant={buttonVariant}
							size="sm"
							className="text-xs"
							onClick={onEventDialogOpen}
						>
							<Plus className="h-3 w-3 mr-1" />
							<span className="sr-only md:not-sr-only md:ml-2">Adicionar</span>
						</Button>
						<Button
							onClick={onAIDialogOpen}
							size="sm"
							className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/20 md:flex-1"
							variant={buttonVariant}
						>
							<Sparkles className="w-4 h-4" />
							<span className="sr-only md:not-sr-only md:ml-2">
								Gerar com IA
							</span>
						</Button>
					</div>
				</div>
			</div>
		</Card>
	);
};
