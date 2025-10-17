import {
	Circle,
	Flame,
	Folder,
	Play,
	Plus,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTaskGroupsWithDetails } from "@/hooks/use-task-groups-with-details";
import type { Task } from "@/types/tasks";
import { getPriorityColor, iconOptions } from "@/utils/taskUtils";

export function DashboardPage() {
	const { taskGroupsWithDetails, isLoading: isLoadingGroups } =
		useTaskGroupsWithDetails();

	// Pegar os últimos 3 grupos criados (mais recentes primeiro)
	const recentGroups = React.useMemo(() => {
		return [...taskGroupsWithDetails].reverse().slice(0, 3);
	}, [taskGroupsWithDetails]);

	return (
		<div className="p-3 pb-24 space-y-4">
			{/* Mobile Streak Card */}
			<div className="md:hidden">
				<Card className="bg-gradient-streak border-0 p-4 shadow-success">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="p-2 rounded-full bg-white/20">
								<Flame className="h-4 w-4 text-white" />
							</div>
							<div>
								<h3 className="text-sm font-semibold text-white">Sequência</h3>
								<p className="text-xs text-white/80">Dias consecutivos</p>
							</div>
						</div>
						<div className="text-right">
							<div className="text-2xl font-bold text-white">7</div>
							<p className="text-xs text-white/80">dias</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Desktop Layout - Side by Side */}
			<div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
				{/* Today's Tasks */}
				<Card className="bg-gradient-card border-border/50 p-4">
					<div className="flex items-center justify-between mb-3">
						<h2 className="text-sm font-semibold text-foreground">
							Tarefas de Hoje
						</h2>
						<p className="text-xs text-muted-foreground">
							Suas prioridades para hoje
						</p>
					</div>

					<div className="space-y-2"></div>

					<Button
						variant="outline"
						className="w-full mt-3 h-8 text-xs bg-gradient-primary border-0 text-white hover:opacity-90"
					>
						Ver todas as tarefas
					</Button>
				</Card>

				{/* Recent Task Groups */}
				<Card className="bg-gradient-card border-border/50 p-4">
					<h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
						<Target className="h-4 w-4 text-primary" />
						Grupos Recentes
					</h2>

					<div className="space-y-2">
						{isLoadingGroups ? (
							<p className="text-xs text-muted-foreground text-center py-4">
								Carregando...
							</p>
						) : recentGroups.length === 0 ? (
							<p className="text-xs text-muted-foreground text-center py-4">
								Nenhum grupo criado
							</p>
						) : (
							recentGroups.map((group) => {
								const progress =
									group.taskCount > 0
										? Math.round((group.completedCount / group.taskCount) * 100)
										: 0;

								return (
									<div
										key={group.id}
										className="p-3 bg-background/50 rounded-lg"
									>
										<div className="flex items-center gap-2 mb-2">
											{React.createElement(
												iconOptions.find((opt) => opt.value === group.icon)
													?.icon || Folder,
												{
													className: "h-3 w-3",
													style: {
														color: group.color?.startsWith("#")
															? group.color
															: undefined,
													},
												},
											)}
											<span className="flex-1 text-xs font-medium">
												{group.name}
											</span>
											{progress === 100 && (
												<Badge
													variant="secondary"
													className="bg-success text-success-foreground text-xs px-1 py-0"
												>
													✓
												</Badge>
											)}
										</div>
										<Progress value={progress} className="h-1.5" />
										<p className="text-xs text-muted-foreground mt-1">
											{group.completedCount} de {group.taskCount} concluídas (
											{progress}%)
										</p>
									</div>
								);
							})
						)}
					</div>
				</Card>
			</div>

			{/* Mobile Layout - Stacked */}
			<div className="lg:hidden space-y-4">
				{/* Today's Tasks */}
				<Card className="bg-gradient-card border-border/50 p-4">
					<div className="flex items-center justify-between mb-3">
						<h2 className="text-sm font-semibold text-foreground">
							Tarefas de Hoje
						</h2>
						<p className="text-xs text-muted-foreground">
							Suas prioridades para hoje
						</p>
					</div>

					<div className="space-y-2"></div>

					<Button
						variant="outline"
						className="w-full mt-3 h-8 text-xs bg-gradient-primary border-0 text-white hover:opacity-90"
					>
						Ver todas as tarefas
					</Button>
				</Card>

				{/* Recent Task Groups */}
				<div className="space-y-3">
					<h2 className="text-sm font-semibold flex items-center gap-2">
						<Target className="h-4 w-4 text-primary" />
						Grupos Recentes
					</h2>

					<div className="space-y-2">
						{isLoadingGroups ? (
							<p className="text-xs text-muted-foreground text-center py-4">
								Carregando...
							</p>
						) : recentGroups.length === 0 ? (
							<p className="text-xs text-muted-foreground text-center py-4">
								Nenhum grupo criado
							</p>
						) : (
							recentGroups.map((group) => {
								const progress =
									group.taskCount > 0
										? Math.round((group.completedCount / group.taskCount) * 100)
										: 0;

								return (
									<Card
										key={group.id}
										className="p-3 bg-gradient-card border-border/50"
									>
										<div className="flex items-center gap-2 mb-2">
											{React.createElement(
												iconOptions.find((opt) => opt.value === group.icon)
													?.icon || Folder,
												{
													className: "h-3 w-3",
													style: {
														color: group.color?.startsWith("#")
															? group.color
															: undefined,
													},
												},
											)}
											<span className="flex-1 text-xs font-medium">
												{group.name}
											</span>
											{progress === 100 && (
												<Badge
													variant="secondary"
													className="bg-success text-success-foreground text-xs px-1 py-0"
												>
													✓
												</Badge>
											)}
										</div>
										<Progress value={progress} className="h-1.5" />
										<p className="text-xs text-muted-foreground mt-1">
											{group.completedCount} de {group.taskCount} concluídas (
											{progress}%)
										</p>
									</Card>
								);
							})
						)}
					</div>
				</div>
			</div>

			{/* Quick Actions - Compact */}
			<div className="space-y-3">
				<h2 className="text-sm font-semibold flex items-center gap-2">
					<Zap className="h-4 w-4 text-primary" />
					Ações Rápidas
				</h2>

				<div className="grid grid-cols-2 gap-3">
					<Button
						className="h-16 bg-gradient-primary border-0 shadow-glow hover:shadow-glow"
						size="sm"
					>
						<div className="flex flex-col items-center gap-1">
							<Play className="h-4 w-4" />
							<span className="text-xs">Iniciar Pomodoro</span>
						</div>
					</Button>

					<Button
						variant="outline"
						className="h-16 border-primary/20 hover:bg-primary/10"
						size="sm"
					>
						<div className="flex flex-col items-center gap-1">
							<Plus className="h-4 w-4" />
							<span className="text-xs">Nova Tarefa</span>
						</div>
					</Button>
				</div>
			</div>

			{/* Stats Overview - Compact */}
			<Card className="p-3 bg-gradient-card border-border/50">
				<h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
					<TrendingUp className="h-3 w-3 text-primary" />
					Esta Semana
				</h3>
				<div className="grid grid-cols-3 gap-3 text-center">
					<div>
						<div className="text-lg font-bold text-primary">12h</div>
						<p className="text-xs text-muted-foreground">Estudadas</p>
					</div>
					<div>
						<div className="text-lg font-bold text-accent">24</div>
						<p className="text-xs text-muted-foreground">Pomodoros</p>
					</div>
					<div>
						<div className="text-lg font-bold text-success">85%</div>
						<p className="text-xs text-muted-foreground">Metas</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
