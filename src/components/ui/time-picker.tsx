import { format } from "date-fns";
import { Clock } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TimePickerProps {
	date?: Date;
	onChange?: (date: Date | undefined) => void;
	placeholder?: string;
	className?: string;
}

export function TimePicker({
	date,
	onChange,
	placeholder = "Selecionar horário",
	className,
}: TimePickerProps) {
	const [open, setOpen] = React.useState(false);
	const [selectedHour, setSelectedHour] = React.useState<string>(
		date ? format(date, "HH") : "09",
	);
	const [selectedMinute, setSelectedMinute] = React.useState<string>(
		date ? format(date, "mm") : "00",
	);

	const hours = Array.from({ length: 24 }, (_, i) =>
		i.toString().padStart(2, "0"),
	);

	const minutes = Array.from({ length: 60 }, (_, i) =>
		i.toString().padStart(2, "0"),
	).filter((_, i) => i % 5 === 0); // Intervalos de 5 minutos

	const applyTime = () => {
		const newDate = new Date();
		newDate.setHours(parseInt(selectedHour));
		newDate.setMinutes(parseInt(selectedMinute));
		newDate.setSeconds(0);
		newDate.setMilliseconds(0);

		onChange?.(newDate);
		setOpen(false);
	};

	const timeDisplay = date ? format(date, "HH:mm") : placeholder;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-full justify-start text-left font-normal",
						!date && "text-muted-foreground",
						className,
					)}
				>
					<Clock className="mr-2 h-4 w-4" />
					{timeDisplay}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-4" align="start">
				<div className="space-y-4">
					<div className="text-sm font-medium text-center">
						Selecionar Horário
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="text-xs font-medium text-muted-foreground">
								Hora
							</div>
							<Select value={selectedHour} onValueChange={setSelectedHour}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="h-48">
									{hours.map((hour) => (
										<SelectItem key={hour} value={hour}>
											{hour}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<div className="text-xs font-medium text-muted-foreground">
								Minuto
							</div>
							<Select value={selectedMinute} onValueChange={setSelectedMinute}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="h-48">
									{minutes.map((minute) => (
										<SelectItem key={minute} value={minute}>
											{minute}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex gap-2 pt-2">
						<Button
							variant="outline"
							className="flex-1"
							onClick={() => setOpen(false)}
						>
							Cancelar
						</Button>
						<Button className="flex-1" onClick={applyTime}>
							Aplicar
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
