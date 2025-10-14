import { api } from "@/lib/apiClient";
import type { UpdateUserData, User } from "@/types/user";

export const userService = {
	async updateUser(data: UpdateUserData): Promise<User> {
		const response = await api.put("/profile", data);
		return response.data;
	},
};
