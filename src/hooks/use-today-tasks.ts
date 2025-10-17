import { useQuery } from "@tanstack/react-query";
import { tasksService } from "@/services/tasksService";
import type { Task } from "@/types/tasks";

export function useTodayTasks() {
	return useQuery({
		queryKey: ["today-tasks"],
		queryFn: async (): Promise<Task[]> => {
			const allTasks = await tasksService.getAllTasks();
			return filterTodayTasks(allTasks);
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

function filterTodayTasks(tasks: Task[]): Task[] {
	const today = new Date();
	const startOfDay = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
		0,
		0,
		0,
		0,
	);
	const endOfDay = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
		23,
		59,
		59,
		999,
	);

	return tasks.filter((task) => {
		// Skip tasks without dates
		if (!task.startDate && !task.endDate) {
			return false;
		}

		const startDate = task.startDate ? new Date(task.startDate) : null;
		const endDate = task.endDate ? new Date(task.endDate) : null;

		// Task starts today
		if (startDate && startDate >= startOfDay && startDate <= endOfDay) {
			return true;
		}

		// Task ends today
		if (endDate && endDate >= startOfDay && endDate <= endOfDay) {
			return true;
		}

		// Task spans across today (starts before today and ends after today)
		if (startDate && endDate && startDate < startOfDay && endDate > endOfDay) {
			return true;
		}

		// Task is all day and is today
		if (
			task.allDay &&
			startDate &&
			startDate.toDateString() === today.toDateString()
		) {
			return true;
		}

		return false;
	});
}
