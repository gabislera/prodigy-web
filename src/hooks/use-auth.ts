import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { ApiError } from "@/types/api";
import type { LoginData } from "@/types/auth";

const AUTH_QUERY_KEY = ["auth", "me"] as const;

interface UseAuthOptions {
	/** Disable automatic user fetch (useful for login/register pages) */
	enabled?: boolean;
}

/**
 * Hook for authentication management with httpOnly cookies
 *
 * @example
 * // On protected pages (default behavior)
 * const { user, isLoadingUser } = useAuth();
 *
 * @example
 * // On public pages (login/register)
 * const { login } = useAuth({ enabled: false });
 */
export const useAuth = (options?: UseAuthOptions) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	// Fetch current user from /auth/me endpoint
	const { data: user, isLoading: isLoadingUser } = useQuery({
		queryKey: AUTH_QUERY_KEY,
		queryFn: authService.getCurrentUser,
		staleTime: 5 * 60 * 1000, // Cache for 5 minutes
		retry: false, // Don't retry 401 errors
		enabled: options?.enabled ?? true,
	});

	const loginMutation = useMutation({
		mutationFn: (data: LoginData) => authService.login(data),
		onSuccess: (data) => {
			// Set user data in cache
			queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
			toast.success("Login realizado com sucesso!");
			navigate({ to: "/" });
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao fazer login. Verifique suas credenciais.",
			);
		},
	});

	const registerMutation = useMutation({
		mutationFn: authService.register,
		onSuccess: (data) => {
			// Set user data in cache
			queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
			toast.success("Conta criada com sucesso!");
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
			// Clear all cached data
			queryClient.setQueryData(AUTH_QUERY_KEY, null);
			queryClient.clear();
			toast.success("Logout realizado com sucesso!");
			navigate({ to: "/login" });
		},
		onError: () => {
			// Even if logout fails, clear local data and redirect
			queryClient.setQueryData(AUTH_QUERY_KEY, null);
			queryClient.clear();
			toast.error("Erro ao fazer logout.");
			navigate({ to: "/login" });
		},
	});

	// const refreshTokenMutation = useMutation({
	// 	mutationFn: authService.refreshToken,
	// 	onSuccess: () => {
	// 		// Refetch user data after token refresh
	// 		queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
	// 	},
	// 	onError: () => {
	// 		toast.error("Sessão expirada. Faça login novamente.");
	// 	},
	// });

	const isAuthenticated = !!user;

	return {
		user,
		isAuthenticated,
		isLoadingUser,
		login: loginMutation.mutate,
		register: registerMutation.mutate,
		logout: logoutMutation.mutate,
		isLoginLoading: loginMutation.isPending,
		isRegisterLoading: registerMutation.isPending,
		isLogoutLoading: logoutMutation.isPending,
		loginError: loginMutation.error,
		registerError: registerMutation.error,
		logoutError: logoutMutation.error,
	};
};
