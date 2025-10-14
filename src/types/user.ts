export interface User {
	id: string;
	name: string;
	email: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface UpdateUserData {
	name?: string;
	email?: string;
}
