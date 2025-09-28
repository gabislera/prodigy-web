import { z } from "zod";

export const taskSchema = z.object({
	title: z
		.string()
		.min(1, "Título é obrigatório")
		.max(100, "Título deve ter no máximo 100 caracteres"),
	description: z
		.string()
		.max(500, "Descrição deve ter no máximo 500 caracteres")
		.optional(),
	hour: z.string().min(1, "Hora é obrigatória"),
	minute: z.string().min(1, "Minuto é obrigatório"),
	duration: z.string().min(1, "Duração é obrigatória"),
	type: z.string().min(1, "Tipo é obrigatório"),
});

export type TaskFormData = z.infer<typeof taskSchema>;
