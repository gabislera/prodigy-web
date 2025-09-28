import { z } from "zod";

export const aiPlanSchema = z.object({
	objective: z
		.string()
		.min(1, "Objetivo é obrigatório")
		.max(500, "Objetivo deve ter no máximo 500 caracteres"),
	timeToGoal: z.string().min(1, "Prazo é obrigatório"),
	dailyTime: z
		.string()
		.min(1, "Horas por dia é obrigatório")
		.refine(
			(val) => {
				const num = parseFloat(val);
				return !Number.isNaN(num) && num > 0 && num <= 24;
			},
			{
				message: "Deve ser um número entre 1 e 24",
			},
		),
	unavailableDays: z.string().min(1, "Dias livres é obrigatório"),
	preferredTime: z.string().min(1, "Horário preferido é obrigatório"),
});

export type AiPlanFormData = z.infer<typeof aiPlanSchema>;
