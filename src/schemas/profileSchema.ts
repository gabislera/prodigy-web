import { z } from "zod";

export const profileUpdateSchema = z
	.object({
		name: z.string().optional(),
		email: z.email("Email inválido").optional().or(z.literal("")),
	})
	.refine(
		(data) => {
			const hasName = data.name && data.name.trim().length > 0;
			const hasEmail = data.email && data.email.trim().length > 0;
			return hasName || hasEmail;
		},
		{
			message: "Pelo menos um campo deve ser preenchido",
			path: ["name"],
		},
	);

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
