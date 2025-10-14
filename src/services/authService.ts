import axios from "axios";
import type { AuthResponse, LoginData, RegisterData } from "@/types/auth";
import type { User } from "@/types/user";

const API_BASE_URL = "http://localhost:3333";

// Create a separate axios instance for auth endpoints (without interceptors)
const apiPublic = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true, // Enable cookies for auth endpoints
});

export const authService = {
	async login(data: LoginData): Promise<AuthResponse> {
		const response = await apiPublic.post("/auth/login", data);
		const { user, accessToken } = response.data;

		// Store access token (refresh token is handled via HttpOnly cookie)
		localStorage.setItem("accessToken", accessToken);

		return {
			user,
			accessToken,
			refreshToken: "", // Refresh token is handled via HttpOnly cookie
		};
	},

	async register(data: RegisterData): Promise<AuthResponse> {
		const response = await apiPublic.post("/auth/register", data);
		const { user, accessToken } = response.data;

		// Store access token (refresh token is handled via HttpOnly cookie)
		localStorage.setItem("accessToken", accessToken);

		return {
			user,
			accessToken,
			refreshToken: "", // Refresh token is handled via HttpOnly cookie
		};
	},

	async logout(): Promise<void> {
		try {
			await apiPublic.post("/auth/logout");
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			localStorage.removeItem("accessToken");
			// Refresh token is handled via HttpOnly cookie, will be cleared by server
		}
	},

	async refreshToken(): Promise<{ accessToken: string }> {
		// Refresh token is sent via HttpOnly cookie, no need to pass it manually
		const response = await apiPublic.post("/auth/refresh");

		const { accessToken } = response.data;
		localStorage.setItem("accessToken", accessToken);

		return { accessToken };
	},

	getCurrentUser(): User | null {
		const token = localStorage.getItem("accessToken");
		if (!token) return null;

		try {
			const payload = JSON.parse(atob(token.split(".")[1]));
			return {
				id: payload.id,
				name: payload.name,
				email: payload.email,
			};
		} catch (error) {
			console.error("Error decoding JWT:", error);
			return null;
		}
	},

	isAuthenticated(): boolean {
		const token = localStorage.getItem("accessToken");
		if (!token) return false;

		try {
			const payload = JSON.parse(atob(token.split(".")[1]));
			const currentTime = Date.now() / 1000;
			return payload.exp > currentTime;
		} catch {
			return false;
		}
	},
};
