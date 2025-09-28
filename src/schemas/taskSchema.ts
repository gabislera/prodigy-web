import { z } from "zod";

export const taskSchema = z
	.object({
		title: z
			.string()
			.min(1, "Título é obrigatório")
			.max(100, "Título deve ter no máximo 100 caracteres"),
		description: z
			.string()
			.max(500, "Descrição deve ter no máximo 500 caracteres")
			.optional(),
		startTime: z.string().min(1, "Horário de início é obrigatório"),
		endTime: z.string().min(1, "Horário de fim é obrigatório"),
		type: z.string().min(1, "Tipo é obrigatório"),
	})
	.refine(
		(data) => {
			// Validate that the end time is after the start time
			const [startHour, startMinute] = data.startTime.split(":").map(Number);
			const [endHour, endMinute] = data.endTime.split(":").map(Number);
			const startTotalMinutes = startHour * 60 + startMinute;
			const endTotalMinutes = endHour * 60 + endMinute;
			return endTotalMinutes > startTotalMinutes;
		},
		{
			message: "Horário de fim deve ser depois do horário de início",
			path: ["endTime"],
		},
	);

export type TaskFormData = z.infer<typeof taskSchema>;
