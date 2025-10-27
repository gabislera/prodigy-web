import React from "react";
import {
	QuickActions,
	RecentTaskGroupsCard,
	StatsCards,
	TodayTasksCard,
	WeeklyStats,
} from "@/components/dashboard";
import { useTaskGroups } from "@/hooks/use-task-groups";
import type { Task } from "@/types/tasks";

export function DashboardPage() {
	const { taskGroupsWithDetails, isLoading } = useTaskGroups();

	const handleTaskClick = (task: Task) => {
		console.log("Task clicked:", task);
	};

	const stats = React.useMemo(() => {
		const allTasks = taskGroupsWithDetails.flatMap((group) =>
			group.columns.flatMap((column) => column.tasks),
		);

		const completedTasks = allTasks.filter((t) => t.completed === true);

		const inProgressTasks = allTasks.filter(
			(t) => t.completed === false && t.columnId !== null,
		);

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const todayTasks = allTasks.filter((t) => {
			if (t.startDate) {
				const startDate = new Date(t.startDate);
				startDate.setHours(0, 0, 0, 0);
				if (startDate.getTime() === today.getTime()) return true;
			}

			if (t.endDate) {
				const endDate = new Date(t.endDate);
				endDate.setHours(0, 0, 0, 0);
				if (endDate.getTime() === today.getTime()) return true;
			}

			const updatedDate = new Date(t.updatedAt);
			updatedDate.setHours(0, 0, 0, 0);
			return updatedDate.getTime() === today.getTime();
		});

		const efficiency =
			allTasks.length > 0
				? Math.round((completedTasks.length / allTasks.length) * 100)
				: 0;

		return {
			completed: completedTasks.length,
			inProgress: inProgressTasks.length,
			today: todayTasks.length,
			efficiency,
			allTasksCount: allTasks.length,
		};
	}, [taskGroupsWithDetails]);

	return (
		<div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
			{/* Sequência Diária + Metas de Hoje */}
			{/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<DailyStreak streakDays={7} />
				<TodayGoals
					pomodoros={{ completed: 0, total: 8 }}
					tasks={{
						completed: stats.completed,
						total: stats.allTasksCount,
					}}
					focusHours={{ completed: 0, total: 5 }}
				/>
			</div> */}

			{/* Stats Cards */}
			<StatsCards
				completed={stats.completed}
				inProgress={stats.inProgress}
				today={stats.today}
				efficiency={stats.efficiency}
			/>

			{/* Tarefas de Hoje + Grupos Recentes */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<TodayTasksCard onTaskClick={handleTaskClick} />
				<RecentTaskGroupsCard
					taskGroups={taskGroupsWithDetails}
					isLoading={isLoading}
					maxGroups={3}
				/>
				{/* Conquistas - Temporariamente comentado */}
				{/* <AchievementsCard
					completedTasks={stats.completed}
					pomodoros={0}
					streakDays={7}
				/> */}
			</div>

			{/* Ações Rápidas + Esta Semana */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<QuickActions />
				<WeeklyStats
					studyHours={0}
					pomodoros={0}
					goalsPercentage={stats.efficiency}
				/>
			</div>
		</div>
	);
}
