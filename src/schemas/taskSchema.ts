import { z } from "zod";

export const createTaskSchema = z.object({
	title: z
		.string()
		.min(1, "Título é obrigatório")
		.max(100, "Título deve ter no máximo 100 caracteres")
		.trim(),
	description: z.string().optional().default(""),
	priority: z.enum(["low", "medium", "high"], {
		message: "Prioridade deve ser baixa, média ou alta",
	}),
	columnId: z.string().min(1, "Coluna é obrigatória"),
	position: z.number().nonnegative().default(0),
	completed: z.boolean().default(false),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	allDay: z.boolean().default(false),
	status: z.string().default("pending"),
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
	description: z.string().optional(),
});

export const createColumnSchema = z.object({
	title: z
		.string()
		.min(1, "Título da coluna é obrigatório")
		.min(2, "Título deve ter pelo menos 2 caracteres")
		.max(20, "Título deve ter no máximo 20 caracteres")
		.trim(),
});

export const taskFormSchema = z.object({
	title: z
		.string()
		.min(1, "Título é obrigatório")
		.max(100, "Título deve ter no máximo 100 caracteres")
		.trim(),
	description: z.string().optional().default(""),
	startDate: z.date().nullable().optional(),
	endDate: z.date().nullable().optional(),
	priority: z.enum(["low", "medium", "high"], {
		message: "Prioridade deve ser baixa, média ou alta",
	}),
	columnId: z.string().min(1, "Coluna é obrigatória").nullable().optional(),
	completed: z.boolean(),
	allDay: z.boolean().optional().default(false),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
export type CreateColumnFormData = z.infer<typeof createColumnSchema>;
