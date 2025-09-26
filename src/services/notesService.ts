import axios from "axios";

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

const API_BASE_URL = "http://localhost:3333";

export const notesService = {
	async getAllNotes(): Promise<Note[]> {
		const response = await axios.get(`${API_BASE_URL}/notes`);
		return response.data;
	},

	async createNote(data: CreateNoteData): Promise<Note> {
		const response = await axios.post(`${API_BASE_URL}/notes`, data);
		return response.data;
	},

	async updateNote(id: string, data: Partial<CreateNoteData>): Promise<Note> {
		const response = await axios.put(`${API_BASE_URL}/notes/${id}`, data);
		return response.data;
	},

	async deleteNote(id: string): Promise<void> {
		await axios.delete(`${API_BASE_URL}/notes/${id}`);
	},
};
