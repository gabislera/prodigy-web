import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authService, type LoginData } from "@/services/authService";

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
		onError: (error) => {
			console.error("Login error:", error);
		},
	});

	const registerMutation = useMutation({
		mutationFn: authService.register,
		onSuccess: (data) => {
			queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
			navigate({ to: "/" });
		},
	});

	const logoutMutation = useMutation({
		mutationFn: authService.logout,
		onSuccess: () => {
			queryClient.setQueryData(AUTH_QUERY_KEY, null);
			queryClient.clear();
			navigate({ to: "/login" });
		},
	});

	const refreshTokenMutation = useMutation({
		mutationFn: authService.refreshToken,
		onSuccess: () => {
			// Refetch user data after token refresh
			queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
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
