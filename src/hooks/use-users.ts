import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UpdateUserData, userService } from "../services/userService";

const USER_QUERY_KEY = ["user"] as const;

export function useUsers() {
	const queryClient = useQueryClient();

	const updateUserMutation = useMutation({
		mutationFn: (data: UpdateUserData) => userService.updateUser(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
		},
	});

	return {
		updateUser: updateUserMutation.mutateAsync,
		isUpdating: updateUserMutation.isPending,
	};
}
