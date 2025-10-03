import axios from "axios";

export interface User {
	id: string;
	name: string;
	email: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface AuthResponse {
	user: User;
	accessToken: string;
	refreshToken: string;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface RegisterData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

const API_BASE_URL = "http://localhost:3333";

axios.defaults.baseURL = API_BASE_URL;

// Request interceptor to add auth token
axios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response interceptor to handle token refresh
axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Refresh token is sent via HttpOnly cookie, no need to pass it manually
				const response = await axios.post("/auth/refresh");

				const { accessToken } = response.data;
				localStorage.setItem("accessToken", accessToken);

				// Retry original request
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return axios(originalRequest);
			} catch {
				localStorage.removeItem("accessToken");
				window.location.href = "/login";
			}
		}

		return Promise.reject(error);
	},
);

export const authService = {
	async login(data: LoginData): Promise<AuthResponse> {
		const response = await axios.post("/auth/login", data);
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
		const response = await axios.post("/auth/register", data);
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
			await axios.post("/auth/logout");
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			localStorage.removeItem("accessToken");
			// Refresh token is handled via HttpOnly cookie, will be cleared by server
		}
	},

	async refreshToken(): Promise<{ accessToken: string }> {
		// Refresh token is sent via HttpOnly cookie, no need to pass it manually
		const response = await axios.post("/auth/refresh");

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
				id: payload.sub,
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
