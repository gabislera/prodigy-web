import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { ApiError } from "@/types/api";
import type { LoginData } from "@/types/auth";

const AUTH_QUERY_KEY = ["auth"] as const;

export const useAuth = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { data: user, isLoading: isLoadingUser } = useQuery({
		queryKey: AUTH_QUERY_KEY,
		queryFn: () => {
			const currentUser = authService.getCurrentUser();
			if (!currentUser || !authService.isAuthenticated()) {
				return null;
			}
			return currentUser;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	const loginMutation = useMutation({
		mutationFn: (data: LoginData) => authService.login(data),
		onSuccess: (data) => {
			queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
			navigate({ to: "/" });
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao fazer login. Tente novamente.",
			);
		},
	});

	const registerMutation = useMutation({
		mutationFn: authService.register,
		onSuccess: (data) => {
			queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
			navigate({ to: "/" });
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao criar conta. Tente novamente.",
			);
		},
	});

	const logoutMutation = useMutation({
		mutationFn: authService.logout,
		onSuccess: () => {
			queryClient.setQueryData(AUTH_QUERY_KEY, null);
			queryClient.clear();
			navigate({ to: "/login" });
		},
		onError: () => {
			toast.error("Erro ao fazer logout. Tente novamente.");
		},
	});

	const refreshTokenMutation = useMutation({
		mutationFn: authService.refreshToken,
		onSuccess: () => {
			// Refetch user data after token refresh
			queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
		},
		onError: () => {
			toast.error("Sessão expirada. Faça login novamente.");
		},
	});

	const isAuthenticated = !!user && authService.isAuthenticated();

	return {
		user,
		isAuthenticated,
		isLoadingUser,
		login: loginMutation.mutate,
		register: registerMutation.mutate,
		logout: logoutMutation.mutate,
		refreshToken: refreshTokenMutation.mutate,
		isLoginLoading: loginMutation.isPending,
		isRegisterLoading: registerMutation.isPending,
		isLogoutLoading: logoutMutation.isPending,
		loginError: loginMutation.error,
		registerError: registerMutation.error,
		logoutError: logoutMutation.error,
	};
};
