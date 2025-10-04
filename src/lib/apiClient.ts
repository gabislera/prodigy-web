import axios from "axios";

const API_BASE_URL = "http://localhost:3333";

// Create a separate axios instance for refresh token to avoid interceptor loops
const apiPublic = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

// Create axios instance with auth interceptor
export const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true, // Enable cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
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
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Use a separate axios instance to avoid interceptor loops
				const refreshResponse = await apiPublic.post("/auth/refresh");

				const { accessToken } = refreshResponse.data;
				localStorage.setItem("accessToken", accessToken);

				// Retry original request
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return api(originalRequest);
			} catch {
				localStorage.removeItem("accessToken");
				window.location.href = "/login";
			}
		}

		return Promise.reject(error);
	},
);
