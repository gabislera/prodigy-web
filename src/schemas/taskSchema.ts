import { z } from "zod";
import { colorOptions, iconOptions } from "@/utils/taskUtils";

// Get valid icon and color values from the options
const validIcons = iconOptions.map((option) => option.value);
const validColors = colorOptions.map((option) => option.value);

export const createTaskSchema = z.object({
	title: z
		.string()
		.min(1, "Título é obrigatório")
		.max(100, "Título deve ter no máximo 100 caracteres")
		.trim(),
	description: z.string(),
	priority: z.enum(["low", "medium", "high"], {
		message: "Prioridade deve ser baixa, média ou alta",
	}),
	columnId: z.string().min(1, "Coluna é obrigatória"),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
	id: z.string().min(1, "ID da tarefa é obrigatório"),
});

export const createGroupSchema = z.object({
	name: z
		.string()
		.min(1, "Nome do grupo é obrigatório")
		.min(2, "Nome deve ter pelo menos 2 caracteres")
		.max(50, "Nome deve ter no máximo 50 caracteres")
		.trim(),
	icon: z
		.string()
		.min(1, "Ícone é obrigatório")
		.refine((value) => validIcons.includes(value), {
			message: "Ícone inválido",
		}),
	color: z
		.string()
		.min(1, "Cor é obrigatória")
		.refine((value) => validColors.includes(value), {
			message: "Cor inválida",
		}),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
