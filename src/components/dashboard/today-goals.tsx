import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TodayGoalsProps {
	pomodoros: {
		completed: number;
		total: number;
	};
	tasks: {
		completed: number;
		total: number;
	};
	focusHours: {
		completed: number;
		total: number;
	};
}

export function TodayGoals({ pomodoros, tasks, focusHours }: TodayGoalsProps) {
	const pomodorosProgress =
		pomodoros.total > 0 ? (pomodoros.completed / pomodoros.total) * 100 : 0;
	const tasksProgress =
		tasks.total > 0 ? (tasks.completed / tasks.total) * 100 : 0;
	const focusProgress =
		focusHours.total > 0 ? (focusHours.completed / focusHours.total) * 100 : 0;

	return (
		<Card className="lg:col-span-2 bg-card border-border">
			<CardHeader>
				<CardTitle>Metas de Hoje</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm text-muted-foreground">Pomodoros</span>
						<span className="text-sm font-semibold">
							{pomodoros.completed}/{pomodoros.total}
						</span>
					</div>
					<Progress value={pomodorosProgress} className="h-2" />
				</div>
				<div>
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm text-muted-foreground">
							Tarefas Concluídas
						</span>
						<span className="text-sm font-semibold">
							{tasks.completed}/{tasks.total}
						</span>
					</div>
					<Progress value={tasksProgress} className="h-2" />
				</div>
				<div>
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm text-muted-foreground">Horas de Foco</span>
						<span className="text-sm font-semibold">
							{focusHours.completed}h/{focusHours.total}h
						</span>
					</div>
					<Progress value={focusProgress} className="h-2" />
				</div>
			</CardContent>
		</Card>
	);
}
