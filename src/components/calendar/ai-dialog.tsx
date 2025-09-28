import { zodResolver } from "@hookform/resolvers/zod";
import { Bot } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { type AiPlanFormData, aiPlanSchema } from "@/schemas/aiPlanSchema";

interface AIDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const AIDialog = ({ open, onOpenChange }: AIDialogProps) => {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<AiPlanFormData>({
		resolver: zodResolver(aiPlanSchema),
		defaultValues: {
			objective: "",
			timeToGoal: "",
			dailyTime: "",
			unavailableDays: "",
			preferredTime: "",
		},
	});

	// Reset do formulário quando o diálogo abrir
	useEffect(() => {
		if (open) {
			reset();
		}
	}, [open, reset]);

	const onSubmit = (data: AiPlanFormData) => {
		// Aqui você pode adicionar a lógica para gerar o plano com IA
		console.log("Gerando plano com IA:", data);

		reset();
		onOpenChange(false);
	};

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
				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<label
							htmlFor="objective"
							className="text-right text-sm font-medium"
						>
							Objetivo
						</label>
						<div className="col-span-3 space-y-1">
							<Textarea
								id="objective"
								placeholder="Ex: Aprender React, Preparar apresentação..."
								{...register("objective")}
								className={errors.objective ? "border-red-500" : ""}
							/>
							{errors.objective && (
								<p className="text-sm text-red-500">
									{errors.objective.message}
								</p>
							)}
						</div>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<label
							htmlFor="timeToGoal"
							className="text-right text-sm font-medium"
						>
							Prazo
						</label>
						<div className="col-span-3 space-y-1">
							<Controller
								name="timeToGoal"
								control={control}
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger
											className={errors.timeToGoal ? "border-red-500" : ""}
										>
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
								)}
							/>
							{errors.timeToGoal && (
								<p className="text-sm text-red-500">
									{errors.timeToGoal.message}
								</p>
							)}
						</div>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<label
							htmlFor="dailyTime"
							className="text-right text-sm font-medium"
						>
							Horas/dia
						</label>
						<div className="col-span-3 space-y-1">
							<Input
								id="dailyTime"
								type="number"
								placeholder="2"
								{...register("dailyTime")}
								className={errors.dailyTime ? "border-red-500" : ""}
							/>
							{errors.dailyTime && (
								<p className="text-sm text-red-500">
									{errors.dailyTime.message}
								</p>
							)}
						</div>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<label
							htmlFor="unavailableDays"
							className="text-right text-sm font-medium"
						>
							Dias livres
						</label>
						<div className="col-span-3 space-y-1">
							<Controller
								name="unavailableDays"
								control={control}
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger
											className={errors.unavailableDays ? "border-red-500" : ""}
										>
											<SelectValue placeholder="Selecione os dias" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="weekdays">Segunda a Sexta</SelectItem>
											<SelectItem value="weekends">Fins de semana</SelectItem>
											<SelectItem value="custom">Personalizado</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{errors.unavailableDays && (
								<p className="text-sm text-red-500">
									{errors.unavailableDays.message}
								</p>
							)}
						</div>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<label
							htmlFor="preferredTime"
							className="text-right text-sm font-medium"
						>
							Horário
						</label>
						<div className="col-span-3 space-y-1">
							<Controller
								name="preferredTime"
								control={control}
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger
											className={errors.preferredTime ? "border-red-500" : ""}
										>
											<SelectValue placeholder="Horário preferido" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="morning">Manhã (6h-12h)</SelectItem>
											<SelectItem value="afternoon">Tarde (12h-18h)</SelectItem>
											<SelectItem value="evening">Noite (18h-22h)</SelectItem>
											<SelectItem value="flexible">Flexível</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{errors.preferredTime && (
								<p className="text-sm text-red-500">
									{errors.preferredTime.message}
								</p>
							)}
						</div>
					</div>
				</form>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						className="bg-gradient-primary border-0"
						onClick={handleSubmit(onSubmit)}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Gerando..." : "Gerar Plano"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
