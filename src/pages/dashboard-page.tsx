import {
	QuickActions,
	RecentTaskGroupsCard,
	StatsCards,
	TodayTasksCard,
	WeeklyStats,
} from "@/components/dashboard";
import { useTaskGroups } from "@/hooks/use-task-groups";
import { useTaskStats } from "@/hooks/use-task-stats";
import type { Task } from "@/types/tasks";

export function DashboardPage() {
	const { taskGroups, isLoading: isLoadingGroups } = useTaskGroups();
	const { stats } = useTaskStats();

	const handleTaskClick = (task: Task) => {
		console.log("Task clicked:", task);
	};

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
				completed={stats.completedTasks}
				inProgress={stats.inProgressTasks}
				today={stats.todayTasks}
				efficiency={stats.efficiency}
			/>

			{/* Tarefas de Hoje + Grupos Recentes */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<TodayTasksCard onTaskClick={handleTaskClick} />
				<RecentTaskGroupsCard
					taskGroups={taskGroups}
					isLoading={isLoadingGroups}
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
