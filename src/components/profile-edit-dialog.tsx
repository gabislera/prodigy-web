import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useUsers } from "@/hooks/use-users";
import {
	type ProfileUpdateData,
	profileUpdateSchema,
} from "@/schemas/profileSchema";

interface ProfileEditDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ProfileEditDialog({
	isOpen,
	onOpenChange,
}: ProfileEditDialogProps) {
	const { user } = useAuth();
	const { updateUser, isUpdating } = useUsers();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		setValue,
	} = useForm<ProfileUpdateData>({
		resolver: zodResolver(profileUpdateSchema),
		defaultValues: {
			name: "",
			email: "",
		},
	});

	const onSubmit = async (data: ProfileUpdateData) => {
		try {
			const updateData: { name?: string; email?: string } = {};
			if (data.name?.trim()) updateData.name = data.name.trim();
			if (data.email?.trim()) updateData.email = data.email.trim();

			await updateUser(updateData);

			onOpenChange(false);
			reset();
		} catch (error: unknown) {
			const errorMessage =
				error && typeof error === "object" && "response" in error
					? (error as { response?: { data?: { message?: string } } })?.response
							?.data?.message
					: "Erro ao atualizar perfil";
			toast.error(errorMessage);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		onOpenChange(newOpen);
		if (newOpen) {
			setValue("name", user?.name || "");
			setValue("email", user?.email || "");
		} else {
			reset();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Editar Perfil</DialogTitle>
					<DialogDescription>
						Atualize suas informações pessoais. Deixe em branco os campos que
						não deseja alterar.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Nome
							</Label>
							<div className="col-span-3">
								<Input
									id="name"
									{...register("name")}
									className={errors.name ? "border-red-500" : ""}
									placeholder="Seu nome completo"
								/>
								{errors.name && (
									<p className="text-sm text-red-500 mt-1">
										{errors.name.message}
									</p>
								)}
							</div>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="email" className="text-right">
								Email
							</Label>
							<div className="col-span-3">
								<Input
									id="email"
									type="email"
									{...register("email")}
									className={errors.email ? "border-red-500" : ""}
									placeholder="seu@email.com"
								/>
								{errors.email && (
									<p className="text-sm text-red-500 mt-1">
										{errors.email.message}
									</p>
								)}
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isSubmitting || isUpdating}>
							{isSubmitting || isUpdating ? "Salvando..." : "Salvar"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
