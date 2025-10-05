import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import type { CreateNoteData, Note } from "@/services/notesService";
import { notesService } from "@/services/notesService";
import type { ApiError } from "@/types/api";

const NOTES_QUERY_KEY = ["notes"] as const;

export function useNotes() {
	const queryClient = useQueryClient();
	const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const {
		data: notes = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: NOTES_QUERY_KEY,
		queryFn: notesService.getAllNotes,
	});

	const createNoteMutation = useMutation({
		mutationFn: notesService.createNote,
		onSuccess: (newNote) => {
			queryClient.setQueryData(NOTES_QUERY_KEY, (old: Note[] = []) => [
				newNote,
				...old,
			]);
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao criar nota. Tente novamente.",
			);
		},
	});

	const updateNoteMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<CreateNoteData> }) =>
			notesService.updateNote(id, data),
		onSuccess: (updatedNote) => {
			queryClient.setQueryData(NOTES_QUERY_KEY, (old: Note[] = []) =>
				old.map((note) => (note.id === updatedNote.id ? updatedNote : note)),
			);
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao atualizar nota. Tente novamente.",
			);
		},
	});

	const deleteNoteMutation = useMutation({
		mutationFn: notesService.deleteNote,
		onSuccess: (_, deletedId) => {
			queryClient.setQueryData(NOTES_QUERY_KEY, (old: Note[] = []) =>
				old.filter((note) => note.id !== deletedId),
			);
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao excluir nota. Tente novamente.",
			);
		},
	});

	// Auto-save note with debounced API call (1 second delay)
	const debouncedUpdateNote = useCallback(
		(noteId: string, updates: Partial<CreateNoteData>) => {
			// Clear existing timeout
			if (updateTimeoutRef.current) {
				clearTimeout(updateTimeoutRef.current);
			}

			// Update immediately in cache for better UX
			queryClient.setQueryData(NOTES_QUERY_KEY, (old: Note[] = []) =>
				old.map((note) =>
					note.id === noteId
						? { ...note, ...updates, updatedAt: new Date() }
						: note,
				),
			);

			// Debounce API call
			updateTimeoutRef.current = setTimeout(() => {
				updateNoteMutation.mutate({ id: noteId, data: updates });
			}, 1000);
		},
		[queryClient, updateNoteMutation],
	);

	return {
		notes,
		isLoading,
		error,
		createNote: createNoteMutation.mutateAsync,
		updateNote: updateNoteMutation.mutateAsync,
		debouncedUpdateNote,
		deleteNote: deleteNoteMutation.mutateAsync,
		isCreating: createNoteMutation.isPending,
		isUpdating: updateNoteMutation.isPending,
		isDeleting: deleteNoteMutation.isPending,
	};
}
