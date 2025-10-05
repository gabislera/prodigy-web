import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";
import { type UpdateUserData, userService } from "../services/userService";

const USER_QUERY_KEY = ["user"] as const;

export function useUsers() {
	const queryClient = useQueryClient();

	const updateUserMutation = useMutation({
		mutationFn: (data: UpdateUserData) => userService.updateUser(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao atualizar perfil. Tente novamente.",
			);
		},
	});

	return {
		updateUser: updateUserMutation.mutateAsync,
		isUpdating: updateUserMutation.isPending,
	};
}
