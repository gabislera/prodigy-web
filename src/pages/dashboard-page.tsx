import { useNavigate } from "@tanstack/react-router";
import {
	QuickActions,
	RecentTaskGroupsCard,
	StatsCards,
	TodayTasksCard,
	WeeklyStats,
} from "@/components/dashboard";
import { useTaskGroupsWithDetails } from "@/hooks/use-task-groups-with-details";
import { useTaskStats } from "@/hooks/use-task-stats";
import type { Task } from "@/types/tasks";

export function DashboardPage() {
	const { taskGroupsWithDetails, isLoading: isLoadingGroups } =
		useTaskGroupsWithDetails();
	const { stats } = useTaskStats();
	const navigate = useNavigate();

	const findGroupIdByColumnId = (columnId: string): string | undefined => {
		for (const group of taskGroupsWithDetails) {
			const hasColumn = group.columns.some((column) => column.id === columnId);
			if (hasColumn) {
				return group.id;
			}
		}
		return undefined;
	};

	const handleTaskClick = (task: Task) => {
		if (task.columnId) {
			const groupId = findGroupIdByColumnId(task.columnId);
			if (groupId) {
				navigate({ to: `/tasks/${groupId}` });
			}
		}
	};

	const handleGroupClick = (group: { id: string }) => {
		navigate({ to: `/tasks/${group.id}` });
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
				<TodayTasksCard
					taskGroups={taskGroupsWithDetails}
					isLoading={isLoadingGroups}
					onTaskClick={handleTaskClick}
					maxItems={3}
				/>
				<RecentTaskGroupsCard
					taskGroups={taskGroupsWithDetails}
					isLoading={isLoadingGroups}
					maxGroups={2}
					onGroupClick={handleGroupClick}
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
