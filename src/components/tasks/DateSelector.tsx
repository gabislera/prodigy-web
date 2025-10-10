import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DateSelectorProps {
	children?: React.ReactNode;
	onSelectRange?: (range: DateRange | undefined) => void; // callback opcional
	initialRange?: DateRange;
	hasDate?: boolean;
	onDateToggle?: (enabled: boolean) => void;
}

export const DateSelector = ({
	children,
	onSelectRange,
	initialRange,
	hasDate = false, // Default para false - será controlado pelo componente pai
	onDateToggle,
}: DateSelectorProps) => {
	const [open, setOpen] = useState(false);
	const [range, setRange] = useState<DateRange | undefined>(initialRange);

	const handleConfirm = () => {
		if (onSelectRange) {
			if (hasDate) {
				// Se o switch estiver ativado mas não há range selecionado, usa o dia atual
				if (!range?.from || !range?.to) {
					const today = new Date();
					const currentRange = { from: today, to: today };
					onSelectRange(currentRange);
				} else {
					onSelectRange(range);
				}
			} else {
				// Se o switch estiver desativado, envia undefined para salvar null
				onSelectRange(undefined);
			}
		}
		setOpen(false);
	};

	const handleDateToggle = (enabled: boolean) => {
		if (onDateToggle) {
			onDateToggle(enabled);
		}
		// Se desativar, limpa a seleção
		if (!enabled) {
			setRange(undefined);
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger className="hover:text-white" asChild>
				{children}
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0 " align="start">
				<div className="flex flex-col items-center gap-4 p-4">
					<div className="flex items-center space-x-2 w-full">
						<Checkbox
							id="task-date"
							checked={hasDate}
							onCheckedChange={handleDateToggle}
						/>
						<Label htmlFor="task-date" className="text-sm font-medium">
							Definir data
						</Label>
					</div>

					<div
						className={`relative ${!hasDate ? "pointer-events-none opacity-50" : ""}`}
					>
						<Calendar
							mode="range"
							selected={range}
							onSelect={hasDate ? setRange : undefined}
							numberOfMonths={1}
							defaultMonth={range?.from || new Date()}
							locale={ptBR}
							className="calendar-transparent"
						/>
					</div>

					{range?.from && range?.to && hasDate && (
						<p className="text-sm text-muted-foreground">
							{range.from.getTime() === range.to.getTime()
								? format(range.from, "dd/MM/yyyy", { locale: ptBR })
								: `${format(range.from, "dd/MM/yyyy", { locale: ptBR })} → ${format(range.to, "dd/MM/yyyy", { locale: ptBR })}`}
						</p>
					)}

					<Button
						onClick={handleConfirm}
						className="mt-2 w-full bg-gradient-primary border-0"
					>
						Confirmar
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};
