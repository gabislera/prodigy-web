import axios from "axios";

const API_BASE_URL = "http://localhost:3333";

/**
 * API client configured to work with httpOnly cookies
 * Tokens are automatically sent by the browser - no manual handling needed
 */
export const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true, // Enables cookies for all requests
	headers: {
		"Content-Type": "application/json",
	},
});

// Simple flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

/**
 * Interceptor to automatically refresh expired access tokens
 * Simple and straightforward - no complex queueing system needed
 */
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const status = error.response?.status;

		// Only handle 401 errors
		if (status !== 401) {
			return Promise.reject(error);
		}

		// Don't retry auth endpoints or already retried requests
		const isAuthEndpoint = originalRequest.url?.includes("/auth/");
		if (isAuthEndpoint || originalRequest._isRetry) {
			// If auth endpoint fails, redirect to login
			if (isAuthEndpoint && !window.location.pathname.includes("/login")) {
				window.location.href = "/login";
			}
			return Promise.reject(error);
		}

		// If already refreshing, wait for it
		if (isRefreshing && refreshPromise) {
			try {
				await refreshPromise;
				originalRequest._isRetry = true;
				return api(originalRequest);
			} catch {
				return Promise.reject(error);
			}
		}

		// Start refresh process
		isRefreshing = true;
		originalRequest._isRetry = true;

		refreshPromise = api
			.post("/auth/refresh")
			.then(() => {
				// Success - token refreshed
			})
			.catch(() => {
				// Refresh failed - redirect to login
				if (!window.location.pathname.includes("/login")) {
					window.location.href = "/login";
				}
				throw error;
			})
			.finally(() => {
				isRefreshing = false;
				refreshPromise = null;
			});

		try {
			await refreshPromise;
			return api(originalRequest);
		} catch {
			return Promise.reject(error);
		}
	},
);
