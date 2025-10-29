import { api } from "@/lib/apiClient";
import type { AuthResponse, LoginData, RegisterData } from "@/types/auth";
import type { User } from "@/types/user";

/**
 * Authentication service that works with httpOnly cookies
 * All JWT handling is done server-side via cookies - no localStorage needed
 */
export const authService = {
	/**
	 * Login with email and password
	 * Tokens are set in httpOnly cookies by the server
	 */
	async login(data: LoginData): Promise<AuthResponse> {
		const response = await api.post("/auth/login", data);
		const { user } = response.data;

		return {
			user,
			accessToken: "", // Token is in httpOnly cookie
			refreshToken: "", // Refresh token is in httpOnly cookie
		};
	},

	/**
	 * Register a new user
	 * Tokens are set in httpOnly cookies by the server
	 */
	async register(data: RegisterData): Promise<AuthResponse> {
		const response = await api.post("/auth/register", data);
		const { user } = response.data;

		return {
			user,
			accessToken: "", // Token is in httpOnly cookie
			refreshToken: "", // Refresh token is in httpOnly cookie
		};
	},

	/**
	 * Logout the current user
	 * Server will clear the httpOnly cookies
	 */
	async logout(): Promise<void> {
		try {
			await api.post("/auth/logout");
		} catch (error) {
			console.error("Logout error:", error);
			throw error;
		}
	},

	/**
	 * Get current authenticated user
	 * Calls /auth/me endpoint which validates the token cookie
	 */
	async getCurrentUser(): Promise<User | null> {
		try {
			const response = await api.get("/auth/me");
			return response.data.user;
		} catch {
			// Not authenticated or token expired
			return null;
		}
	},

	/**
	 * Check if user is authenticated
	 * Calls /auth/me endpoint to validate the session
	 */
	async isAuthenticated(): Promise<boolean> {
		try {
			await api.get("/auth/me");
			return true;
		} catch {
			return false;
		}
	},
};
