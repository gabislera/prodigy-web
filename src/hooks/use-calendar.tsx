import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { calendarService, type Event } from "@/services/calendarService";

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
	});

	const deleteEventMutation = useMutation({
		mutationFn: calendarService.deleteEvent,
		onSuccess: (_, deletedId) => {
			queryClient.setQueryData(CALENDAR_QUERY_KEY, (old: Event[] = []) =>
				old.filter((event) => event.id !== deletedId),
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
