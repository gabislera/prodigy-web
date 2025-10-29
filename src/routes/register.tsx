import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { type RegisterFormData, registerSchema } from "@/schemas/authSchema";

export const Route = createFileRoute("/register")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const {
		user,
		register: registerUser,
		isRegisterLoading,
		registerError,
	} = useAuth({
		enabled: false,
	});

	// Redirect to home if already authenticated
	useEffect(() => {
		if (user) {
			navigate({ to: "/" });
		}
	}, [user, navigate]);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		// watch,
		// setValue,
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			// acceptTerms: false,
		},
	});

	// const acceptTerms = watch("acceptTerms");

	const onSubmit = (data: RegisterFormData) => {
		registerUser(data);
	};
	return (
		<div className="dark min-h-screen flex items-center justify-center bg-background p-4">
			<div className="w-full max-w-md space-y-8">
				<Card className="border-border bg-card">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold text-card-foreground">
							Criar sua conta
						</CardTitle>
						<CardDescription className="text-muted-foreground">
							Preencha os dados abaixo para começar
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name" className="text-foreground">
									Nome completo
								</Label>
								<Input
									id="name"
									type="text"
									placeholder="Seu nome"
									{...register("name")}
									className={`bg-input border-border text-foreground placeholder:text-muted-foreground ${
										errors.name ? "border-red-500" : ""
									}`}
								/>
								{errors.name && (
									<p className="text-xs text-red-500">{errors.name.message}</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="email" className="text-foreground">
									Email
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="seu@email.com"
									{...register("email")}
									className={`bg-input border-border text-foreground placeholder:text-muted-foreground ${
										errors.email ? "border-red-500" : ""
									}`}
								/>
								{errors.email && (
									<p className="text-xs text-red-500">{errors.email.message}</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="password" className="text-foreground">
									Senha
								</Label>
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									{...register("password")}
									className={`bg-input border-border text-foreground placeholder:text-muted-foreground ${
										errors.password ? "border-red-500" : ""
									}`}
								/>
								{errors.password ? (
									<p className="text-xs text-red-500">
										{errors.password.message}
									</p>
								) : (
									<p className="text-xs text-muted-foreground">
										Mínimo de 8 caracteres, com letra maiúscula, minúscula e
										número
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="confirmPassword" className="text-foreground">
									Confirmar senha
								</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="••••••••"
									{...register("confirmPassword")}
									className={`bg-input border-border text-foreground placeholder:text-muted-foreground ${
										errors.confirmPassword ? "border-red-500" : ""
									}`}
								/>
								{errors.confirmPassword && (
									<p className="text-xs text-red-500">
										{errors.confirmPassword.message}
									</p>
								)}
							</div>
							{/* <div className="flex items-start space-x-2">
								<Checkbox
									id="terms"
									checked={acceptTerms}
									onCheckedChange={(checked) =>
										setValue("acceptTerms", checked as boolean)
									}
									className="mt-1"
								/>
								<label
									htmlFor="terms"
									className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
								>
									Eu aceito os{" "}
									<Link to="/" className="text-primary hover:text-primary/80">
										termos de uso
									</Link>{" "}
									e a{" "}
									<Link to="/" className="text-primary hover:text-primary/80">
										política de privacidade
									</Link>
								</label>
							</div>
							{errors.acceptTerms && (
								<p className="text-xs text-red-500">
									{errors.acceptTerms.message}
								</p>
							)} */}
							{registerError && (
								<p className="text-xs text-red-500 text-center">
									{registerError instanceof Error
										? registerError.message
										: "Erro ao criar conta. Tente novamente."}
								</p>
							)}
							<Button
								type="submit"
								className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
								disabled={isRegisterLoading || !isValid}
							>
								{isRegisterLoading ? "Criando conta..." : "Criar conta"}
							</Button>
						</form>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						{/* <div className="relative w-full">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-border" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-card px-2 text-muted-foreground">
									Ou registre-se com
								</span>
							</div>
						</div>
						<Button
							variant="outline"
							type="button"
							className="flex items-center gap-1 border-border hover:bg-accent hover:text-second-foreground bg-transparent px-8!"
						>
							<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
								<title>svg</title>

								<path
									fill="currentColor"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="currentColor"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="currentColor"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="currentColor"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							<span>Google</span>
						</Button> */}
						<p className="text-center text-sm text-muted-foreground">
							Já tem uma conta?{" "}
							<Link
								to="/login"
								className="text-primary hover:text-primary/80 font-medium transition-colors"
							>
								Fazer login
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
