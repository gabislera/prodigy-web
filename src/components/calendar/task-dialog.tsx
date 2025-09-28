import { zodResolver } from "@hookform/resolvers/zod";
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
import { type TaskFormData, taskSchema } from "@/schemas/taskSchema";

interface TaskDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedDate: Date | null;
}

export const TaskDialog = ({
	open,
	onOpenChange,
	selectedDate,
}: TaskDialogProps) => {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<TaskFormData>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			title: "",
			description: "",
			hour: selectedDate
				? selectedDate.getHours().toString().padStart(2, "0")
				: "09",
			minute: selectedDate
				? selectedDate.getMinutes().toString().padStart(2, "0")
				: "00",
			duration: "",
			type: "",
		},
	});

	// Reset do formulário quando o diálogo abrir/fechar
	useEffect(() => {
		if (open) {
			reset({
				title: "",
				description: "",
				hour: selectedDate
					? selectedDate.getHours().toString().padStart(2, "0")
					: "09",
				minute: selectedDate
					? selectedDate.getMinutes().toString().padStart(2, "0")
					: "00",
				duration: "",
				type: "",
			});
		}
	}, [open, selectedDate, reset]);

	const onSubmit = (data: TaskFormData) => {
		// Criar a data completa com hora e minuto
		const taskDate = selectedDate ? new Date(selectedDate) : new Date();
		taskDate.setHours(parseInt(data.hour));
		taskDate.setMinutes(parseInt(data.minute));
		taskDate.setSeconds(0);
		taskDate.setMilliseconds(0);

		// Aqui você pode adicionar a lógica para criar a tarefa
		console.log("Criando tarefa válida:", {
			...data,
			date: selectedDate,
			time: taskDate,
		});

		reset();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Nova Tarefa</DialogTitle>
					<DialogDescription>
						Criar uma nova tarefa para{" "}
						{selectedDate?.toLocaleDateString("pt-BR")}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
					<div className="space-y-2">
						<label htmlFor="title" className="text-sm font-medium block">
							Título
						</label>
						<Input
							id="title"
							placeholder="Nome da tarefa"
							{...register("title")}
							className={errors.title ? "border-red-500" : ""}
						/>
						{errors.title && (
							<p className="text-sm text-red-500">{errors.title.message}</p>
						)}
					</div>
					<div className="space-y-2">
						<label htmlFor="description" className="text-sm font-medium block">
							Descrição
						</label>
						<Textarea
							id="description"
							placeholder="Descrição da tarefa..."
							{...register("description")}
							className={errors.description ? "border-red-500" : ""}
						/>
						{errors.description && (
							<p className="text-sm text-red-500">
								{errors.description.message}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<div className="text-sm font-medium">Horário</div>
						<div className="grid grid-cols-2 gap-2">
							<div className="flex items-center gap-2">
								<div className="space-y-1">
									<div className="text-xs text-muted-foreground">Hora</div>
									<Controller
										name="hour"
										control={control}
										render={({ field }) => (
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger
													className={errors.hour ? "border-red-500" : ""}
												>
													<SelectValue placeholder="00" />
												</SelectTrigger>
												<SelectContent className="h-48">
													{Array.from({ length: 24 }, (_, i) =>
														i.toString().padStart(2, "0"),
													).map((hour) => (
														<SelectItem key={hour} value={hour}>
															{hour}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
									{errors.hour && (
										<p className="text-xs text-red-500">
											{errors.hour.message}
										</p>
									)}
								</div>
								<div className="space-y-1">
									<div className="text-xs text-muted-foreground">Minuto</div>
									<Controller
										name="minute"
										control={control}
										render={({ field }) => (
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger
													className={errors.minute ? "border-red-500" : ""}
												>
													<SelectValue placeholder="00" />
												</SelectTrigger>
												<SelectContent className="h-48">
													{Array.from({ length: 60 }, (_, i) =>
														i.toString().padStart(2, "0"),
													)
														.filter((_, i) => i % 5 === 0)
														.map((minute) => (
															<SelectItem key={minute} value={minute}>
																{minute}
															</SelectItem>
														))}
												</SelectContent>
											</Select>
										)}
									/>
									{errors.minute && (
										<p className="text-xs text-red-500">
											{errors.minute.message}
										</p>
									)}
								</div>
							</div>
							<div className="space-y-2 w-full">
								<label htmlFor="duration" className="text-sm font-medium block">
									Duração
								</label>
								<Controller
									name="duration"
									control={control}
									render={({ field }) => (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger
												className={errors.duration ? "border-red-500" : ""}
											>
												<SelectValue placeholder="Duração" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="30min">30 minutos</SelectItem>
												<SelectItem value="1h">1 hora</SelectItem>
												<SelectItem value="2h">2 horas</SelectItem>
												<SelectItem value="custom">Personalizado</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
								{errors.duration && (
									<p className="text-sm text-red-500">
										{errors.duration.message}
									</p>
								)}
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<label htmlFor="type" className="text-sm font-medium block">
							Tipo
						</label>
						<Controller
							name="type"
							control={control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger
										className={errors.type ? "border-red-500" : ""}
									>
										<SelectValue placeholder="Selecione o tipo" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="meeting">Reunião</SelectItem>
										<SelectItem value="study">Estudo</SelectItem>
										<SelectItem value="work">Trabalho</SelectItem>
										<SelectItem value="personal">Pessoal</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
						{errors.type && (
							<p className="text-sm text-red-500">{errors.type.message}</p>
						)}
					</div>
				</form>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button
						type="submit"
						className="bg-gradient-primary border-0"
						onClick={handleSubmit(onSubmit)}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Criando..." : "Criar Tarefa"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
