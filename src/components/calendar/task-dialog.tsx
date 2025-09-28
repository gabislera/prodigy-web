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
	// Função para gerar horários de 15 em 15 minutos
	const generateTimeOptions = () => {
		const times: string[] = [];
		for (let hour = 0; hour < 24; hour++) {
			for (let minute = 0; minute < 60; minute += 15) {
				const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
				times.push(timeString);
			}
		}
		return times;
	};

	const timeOptions = generateTimeOptions();

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<TaskFormData>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			title: "",
			description: "",
			startTime: "09:00",
			endTime: "10:00",
			type: "",
		},
	});

	const watchedStartTime = watch("startTime");

	// Form reset when the dialog opens
	useEffect(() => {
		if (open) {
			// Function to calculate the default start time
			const getDefaultStartTime = () => {
				// Use the current time as the base for any selected date
				// selectedDate is used only for context, not for the time calculation
				const now = new Date();
				const currentHour = now.getHours();
				const currentMinute = now.getMinutes();

				// Log for debug (can be removed in production)
				if (selectedDate) {
					console.log(
						`Criando tarefa para ${selectedDate.toDateString()} com horário baseado em ${now.toTimeString()}`,
					);
				}

				// Calculate the next 15 minute slot
				// If it's exactly in the slot (ex: 15:00), keep the same
				// If it's not (ex: 15:05), round to the next (15:15)
				const nextSlotMinute = Math.ceil(currentMinute / 15) * 15;

				// If the rounding passed 60 minutes, adjust the hour
				if (nextSlotMinute >= 60) {
					const nextHour = (currentHour + 1) % 24;
					return `${nextHour.toString().padStart(2, "0")}:00`;
				}

				return `${currentHour.toString().padStart(2, "0")}:${nextSlotMinute.toString().padStart(2, "0")}`;
			};

			// Function to calculate the default end time (1 hour after the start)
			const getDefaultEndTime = (startTime: string) => {
				const [hour, minute] = startTime.split(":").map(Number);
				const totalMinutes = hour * 60 + minute + 60; // Add 1 hour
				const endHour = Math.floor(totalMinutes / 60) % 24;
				const endMinute = totalMinutes % 60;
				return `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
			};

			const newStartTime = getDefaultStartTime();
			const newEndTime = getDefaultEndTime(newStartTime);
			reset({
				title: "",
				description: "",
				startTime: newStartTime,
				endTime: newEndTime,
				type: "",
			});
		}
	}, [open, selectedDate, reset]);

	const onSubmit = (data: TaskFormData) => {
		// Create the full start and end dates
		const baseDate = selectedDate ? new Date(selectedDate) : new Date();

		const [startHour, startMinute] = data.startTime.split(":").map(Number);
		const startDate = new Date(baseDate);
		startDate.setHours(startHour, startMinute, 0, 0);

		const [endHour, endMinute] = data.endTime.split(":").map(Number);
		const endDate = new Date(baseDate);
		endDate.setHours(endHour, endMinute, 0, 0);

		// TODO: Add the logic to create the task
		console.log("Creating valid task:", {
			...data,
			date: selectedDate,
			startDate,
			endDate,
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
						<div className="flex items-center gap-3">
							<div className="space-y-1 flex-1">
								<div className="text-xs text-muted-foreground">Início</div>
								<Controller
									name="startTime"
									control={control}
									render={({ field }) => (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger
												className={errors.startTime ? "border-red-500" : ""}
											>
												<SelectValue placeholder="00:00" />
											</SelectTrigger>
											<SelectContent className="h-48">
												{timeOptions.map((time) => (
													<SelectItem key={time} value={time}>
														{time}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								{errors.startTime && (
									<p className="text-xs text-red-500">
										{errors.startTime.message}
									</p>
								)}
							</div>
							<div className="text-sm text-muted-foreground mt-6">até</div>
							<div className="space-y-1 flex-1">
								<div className="text-xs text-muted-foreground">Fim</div>
								<Controller
									name="endTime"
									control={control}
									render={({ field }) => (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger
												className={errors.endTime ? "border-red-500" : ""}
											>
												<SelectValue placeholder="00:00" />
											</SelectTrigger>
											<SelectContent className="h-48">
												{timeOptions
													.filter((time) => {
														// Filter only times after the start time
														if (!watchedStartTime) return true;
														const [startHour, startMinute] = watchedStartTime
															.split(":")
															.map(Number);
														const [timeHour, timeMinute] = time
															.split(":")
															.map(Number);
														const startTotalMinutes =
															startHour * 60 + startMinute;
														const timeTotalMinutes = timeHour * 60 + timeMinute;
														return timeTotalMinutes > startTotalMinutes;
													})
													.map((time) => (
														<SelectItem key={time} value={time}>
															{time}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
									)}
								/>
								{errors.endTime && (
									<p className="text-xs text-red-500">
										{errors.endTime.message}
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
