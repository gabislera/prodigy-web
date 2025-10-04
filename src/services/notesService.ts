import { api } from "@/lib/apiClient";

export interface Note {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateNoteData {
	title: string;
	content: string;
}

export const notesService = {
	async getAllNotes(): Promise<Note[]> {
		const response = await api.get("/notes");
		return response.data;
	},

	async createNote(data: CreateNoteData): Promise<Note> {
		const response = await api.post("/notes", data);
		return response.data;
	},

	async updateNote(id: string, data: Partial<CreateNoteData>): Promise<Note> {
		const response = await api.put(`/notes/${id}`, data);
		return response.data;
	},

	async deleteNote(id: string): Promise<void> {
		await api.delete(`/notes/${id}`);
	},
};
