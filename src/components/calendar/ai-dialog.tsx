import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AIDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const AIDialog = ({ open, onOpenChange }: AIDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Bot className="h-5 w-5 text-primary" />
						Criar Plano com IA
					</DialogTitle>
					<DialogDescription>
						Vamos criar um plano personalizado de estudos ou trabalho para você.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<label
							htmlFor="objective"
							className="text-right text-sm font-medium"
						>
							Objetivo
						</label>
						<Textarea
							id="objective"
							placeholder="Ex: Aprender React, Preparar apresentação..."
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<label
							htmlFor="timeToGoal"
							className="text-right text-sm font-medium"
						>
							Prazo
						</label>
						<Select>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Selecione o prazo" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1week">1 semana</SelectItem>
								<SelectItem value="2weeks">2 semanas</SelectItem>
								<SelectItem value="1month">1 mês</SelectItem>
								<SelectItem value="3months">3 meses</SelectItem>
								<SelectItem value="6months">6 meses</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<label
							htmlFor="dailyTime"
							className="text-right text-sm font-medium"
						>
							Horas/dia
						</label>
						<Input
							id="dailyTime"
							type="number"
							placeholder="2"
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<label
							htmlFor="unavailableDays"
							className="text-right text-sm font-medium"
						>
							Dias livres
						</label>
						<Select>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Selecione os dias" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="weekdays">Segunda a Sexta</SelectItem>
								<SelectItem value="weekends">Fins de semana</SelectItem>
								<SelectItem value="custom">Personalizado</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<label
							htmlFor="preferredTime"
							className="text-right text-sm font-medium"
						>
							Horário
						</label>
						<Select>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Horário preferido" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="morning">Manhã (6h-12h)</SelectItem>
								<SelectItem value="afternoon">Tarde (12h-18h)</SelectItem>
								<SelectItem value="evening">Noite (18h-22h)</SelectItem>
								<SelectItem value="flexible">Flexível</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button type="submit" className="bg-gradient-primary border-0">
						Gerar Plano
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
