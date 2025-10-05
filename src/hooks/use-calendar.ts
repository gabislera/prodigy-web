import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { calendarService, type Event } from "@/services/calendarService";
import type { ApiError } from "@/types/api";

const CALENDAR_QUERY_KEY = ["calendar"] as const;

export const useCalendar = () => {
	const queryClient = useQueryClient();

	const {
		data: events = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: CALENDAR_QUERY_KEY,
		queryFn: calendarService.getAllEvents,
	});

	const createEventMutation = useMutation({
		mutationFn: calendarService.createEvent,
		onSuccess: (newEvent) => {
			queryClient.setQueryData(CALENDAR_QUERY_KEY, (old: Event[] = []) => [
				newEvent,
				...old,
			]);
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao criar evento. Tente novamente.",
			);
		},
	});

	const deleteEventMutation = useMutation({
		mutationFn: calendarService.deleteEvent,
		onSuccess: (_, deletedId) => {
			queryClient.setQueryData(CALENDAR_QUERY_KEY, (old: Event[] = []) =>
				old.filter((event) => event.id !== deletedId),
			);
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message ||
					"Erro ao excluir evento. Tente novamente.",
			);
		},
	});

	return {
		events,
		isLoading,
		error,
		createEvent: createEventMutation.mutateAsync,
		deleteEvent: deleteEventMutation.mutateAsync,
		isCreating: createEventMutation.isPending,
		isDeleting: deleteEventMutation.isPending,
	};
};
