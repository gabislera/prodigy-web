import { Award, Flame, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AchievementsCardProps {
	completedTasks: number;
	pomodoros: number;
	streakDays: number;
}

export function AchievementsCard({
	completedTasks,
	pomodoros,
	streakDays,
}: AchievementsCardProps) {
	return (
		<Card className="bg-card border-border">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Award className="text-primary" size={20} />
					Conquistas
				</CardTitle>
				<p className="text-sm text-muted-foreground">
					Suas conquistas recentes
				</p>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-3 gap-4">
					<div className="relative">
						<div className="w-full aspect-square rounded-xl border-2 border-success/30 bg-card flex items-center justify-center">
							<Target className="text-success" size={32} />
						</div>
						<div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-success flex items-center justify-center text-xs font-bold">
							{completedTasks}
						</div>
					</div>
					<div className="relative">
						<div className="w-full aspect-square rounded-xl border-2 border-warning/30 bg-card flex items-center justify-center">
							<Zap className="text-warning" size={32} />
						</div>
						<div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-warning flex items-center justify-center text-xs font-bold">
							{pomodoros}
						</div>
					</div>
					<div className="relative">
						<div className="w-full aspect-square rounded-xl border-2 border-accent/30 bg-card flex items-center justify-center">
							<Flame className="text-accent" size={32} />
						</div>
						<div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-bold">
							{streakDays}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
