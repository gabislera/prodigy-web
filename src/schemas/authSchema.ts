import { z } from "zod";

export const loginSchema = z.object({
	email: z.email(),
	password: z
		.string()
		.min(1, "Senha é obrigatória")
		.min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export const registerSchema = z
	.object({
		name: z
			.string()
			.min(2, "Nome deve ter pelo menos 2 caracteres")
			.max(50, "Nome deve ter no máximo 50 caracteres")
			.regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
		email: z.email("Email deve ter um formato válido"),
		password: z
			.string()
			.min(8, "Senha deve ter pelo menos 8 caracteres")
			.max(100, "Senha deve ter no máximo 100 caracteres")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número",
			),
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
		// acceptTerms: z.boolean().refine((val) => val === true, {
		// 	message: "Você deve aceitar os termos de uso",
		// }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
