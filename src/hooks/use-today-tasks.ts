import {
	endOfDay,
	isToday,
	isWithinInterval,
	parseISO,
	startOfDay,
} from "date-fns";
import { useMemo } from "react";
import type { Task } from "@/types/tasks";
import { useTasks } from "./use-tasks";

/**
 * Hook para obter tarefas de hoje
 * Reutiliza os dados do useTasks para evitar requisições duplicadas
 */
export function useTodayTasks() {
	const { tasks: allTasks = [], isLoading, error } = useTasks();

	const todayTasks = useMemo(() => {
		return filterTodayTasks(allTasks);
	}, [allTasks]);

	return {
		data: todayTasks,
		isLoading,
		error,
	};
}

/**
 * Filtra tarefas que são relevantes para hoje
 * Usa date-fns para lógica de datas mais robusta e legível
 */
function filterTodayTasks(tasks: Task[]): Task[] {
	if (!tasks.length) return [];

	return tasks.filter((task) => {
		// Skip tasks without any date information
		if (!task.startDate && !task.endDate) {
			return false;
		}

		// Parse dates safely
		const startDate = task.startDate ? parseISO(task.startDate) : null;
		const endDate = task.endDate ? parseISO(task.endDate) : null;

		// All-day task that is today
		if (task.allDay && startDate && isToday(startDate)) {
			return true;
		}

		// Task with both start and end dates
		if (startDate && endDate) {
			// Task spans across today
			return isWithinInterval(new Date(), {
				start: startOfDay(startDate),
				end: endOfDay(endDate),
			});
		}

		// Task with only start date - check if it's today
		if (startDate && !endDate) {
			return isToday(startDate);
		}

		// Task with only end date - check if it ends today
		if (!startDate && endDate) {
			return isToday(endDate);
		}

		return false;
	});
}
