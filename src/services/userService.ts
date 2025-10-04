import { api } from "@/lib/apiClient";

export interface User {
	id: string;
	name: string;
	email: string;
}

export interface UpdateUserData {
	name?: string;
	email?: string;
}

export const userService = {
	async updateUser(data: UpdateUserData): Promise<User> {
		const response = await api.put("/profile", data);
		return response.data;
	},
};
