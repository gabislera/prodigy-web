import type { User } from "./user";

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
