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

export interface UpdateNoteData {
	title?: string;
	content?: string;
}
