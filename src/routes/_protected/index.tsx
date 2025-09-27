import { createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	Circle,
	Clock,
	Flame,
	Play,
	Plus,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_protected/")({
	component: DashboardHome,
});

function DashboardHome() {
	const today = new Date();
	const dayName = today.toLocaleDateString("pt-BR", { weekday: "long" });
	const date = today.toLocaleDateString("pt-BR");

	const todayTasks = [
		{ name: "Revisar relatório mensal", priority: "high", completed: false },
		{ name: "Reunião com equipe às 14h", priority: "high", completed: false },
		{
			name: "Enviar proposta para cliente",
			priority: "medium",
			completed: true,
		},
	];

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "text-destructive";
			case "medium":
				return "text-warning";
			case "low":
				return "text-success";
			default:
				return "text-muted-foreground";
		}
	};

	return (
		<div className="p-3 pb-24 space-y-4">
			{/* Header */}
			<div className="text-center space-y-1">
				<h1 className="text-xl font-bold text-foreground">
					Olá, Estudante! 👋
				</h1>
				<p className="text-sm text-muted-foreground capitalize">
					{dayName}, {date}
				</p>
			</div>

			{/* Mobile Streak Card */}
			<div className="lg:hidden">
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

					<div className="space-y-2">
						{todayTasks.map((task, index) => (
							<div key={task.name} className="flex items-center gap-2 py-1">
								<Circle
									className={`h-2 w-2 ${getPriorityColor(task.priority)} ${task.completed ? "fill-current" : ""}`}
								/>
								<span
									className={`flex-1 text-xs ${task.completed ? "line-through text-muted-foreground" : ""}`}
								>
									{task.name}
								</span>
							</div>
						))}
					</div>

					<Button
						variant="outline"
						className="w-full mt-3 h-8 text-xs bg-gradient-primary border-0 text-white hover:opacity-90"
					>
						Ver todas as tarefas
					</Button>
				</Card>

				{/* Daily Goals */}
				<Card className="bg-gradient-card border-border/50 p-4">
					<h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
						<Target className="h-4 w-4 text-primary" />
						Metas de Hoje
					</h2>

					<div className="space-y-2">
						{[
							{
								name: "Estudar 2 horas",
								progress: 75,
								icon: BookOpen,
								completed: false,
							},
							{
								name: "3 Pomodoros",
								progress: 100,
								icon: Clock,
								completed: true,
							},
							{
								name: "Revisar notas",
								progress: 50,
								icon: Zap,
								completed: false,
							},
						].map((goal, index) => (
							<div key={goal.name} className="p-3 bg-background/50 rounded-lg">
								<div className="flex items-center gap-2 mb-2">
									<goal.icon className="h-3 w-3 text-primary" />
									<span className="flex-1 text-xs font-medium">
										{goal.name}
									</span>
									{goal.completed && (
										<Badge
											variant="secondary"
											className="bg-success text-success-foreground text-xs px-1 py-0"
										>
											✓
										</Badge>
									)}
								</div>
								<Progress value={goal.progress} className="h-1.5" />
								<p className="text-xs text-muted-foreground mt-1">
									{goal.progress}% concluído
								</p>
							</div>
						))}
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

					<div className="space-y-2">
						{todayTasks.map((task, index) => (
							<div key={task.name} className="flex items-center gap-2 py-1">
								<Circle
									className={`h-2 w-2 ${getPriorityColor(task.priority)} ${task.completed ? "fill-current" : ""}`}
								/>
								<span
									className={`flex-1 text-xs ${task.completed ? "line-through text-muted-foreground" : ""}`}
								>
									{task.name}
								</span>
							</div>
						))}
					</div>

					<Button
						variant="outline"
						className="w-full mt-3 h-8 text-xs bg-gradient-primary border-0 text-white hover:opacity-90"
					>
						Ver todas as tarefas
					</Button>
				</Card>

				{/* Daily Goals */}
				<div className="space-y-3">
					<h2 className="text-sm font-semibold flex items-center gap-2">
						<Target className="h-4 w-4 text-primary" />
						Metas de Hoje
					</h2>

					<div className="space-y-2">
						{[
							{
								name: "Estudar 2 horas",
								progress: 75,
								icon: BookOpen,
								completed: false,
							},
							{
								name: "3 Pomodoros",
								progress: 100,
								icon: Clock,
								completed: true,
							},
							{
								name: "Revisar notas",
								progress: 50,
								icon: Zap,
								completed: false,
							},
						].map((goal, index) => (
							<Card
								key={goal.name}
								className="p-3 bg-gradient-card border-border/50"
							>
								<div className="flex items-center gap-2 mb-2">
									<goal.icon className="h-3 w-3 text-primary" />
									<span className="flex-1 text-xs font-medium">
										{goal.name}
									</span>
									{goal.completed && (
										<Badge
											variant="secondary"
											className="bg-success text-success-foreground text-xs px-1 py-0"
										>
											✓
										</Badge>
									)}
								</div>
								<Progress value={goal.progress} className="h-1.5" />
								<p className="text-xs text-muted-foreground mt-1">
									{goal.progress}% concluído
								</p>
							</Card>
						))}
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
