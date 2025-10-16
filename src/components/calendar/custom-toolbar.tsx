import { ChevronLeft, ChevronRight, Logs } from "lucide-react";
import type { View } from "react-big-calendar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomToolbarProps {
	date: Date;
	view: View;
	onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
	onView: (view: View) => void;
	label: string;
	onSidebarToggle: () => void;
}

export function CustomToolbar({
	view,
	onNavigate,
	onView,
	label,
	onSidebarToggle,
}: CustomToolbarProps) {
	const handlePrevious = () => onNavigate("PREV");
	const handleNext = () => onNavigate("NEXT");
	const handleToday = () => onNavigate("TODAY");

	const viewOptions = [
		{ value: "month", label: "Mês" },
		{ value: "week", label: "Semana" },
		{ value: "day", label: "Dia" },
	] as const;

	return (
		<div className="flex items-center justify-between p-4 border-b">
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={handlePrevious}
					className="h-8 w-8 p-0"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={handleToday}
					className="h-8"
				>
					Hoje
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={handleNext}
					className="h-8 w-8 p-0"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>

				<h2 className="text-lg font-semibold ml-4">{label}</h2>
			</div>

			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={onSidebarToggle}
					className="h-8 w-8 p-0"
				>
					<Logs className="h-4 w-4" />
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							{viewOptions.find((option) => option.value === view)?.label}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{viewOptions.map((option) => (
							<DropdownMenuItem
								key={option.value}
								onClick={() => onView(option.value)}
								className={view === option.value ? "bg-accent" : ""}
							>
								{option.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
