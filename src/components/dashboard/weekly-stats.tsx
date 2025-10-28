import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklyStatsProps {
	studyHours: number;
	pomodoros: number;
	goalsPercentage: number;
}

export function WeeklyStats({
	studyHours,
	pomodoros,
	goalsPercentage,
}: WeeklyStatsProps) {
	return (
		<Card className="bg-card border-border">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TrendingUp className="text-secondary/80" size={24} />
					Esta Semana
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-3 gap-4 text-center">
					<div>
						<div className="text-3xl font-bold text-success mb-1">
							{studyHours}h
						</div>
						<p className="text-xs text-muted-foreground">Estudadas</p>
					</div>
					<div>
						<div className="text-3xl font-bold text-success mb-1">
							{pomodoros}
						</div>
						<p className="text-xs text-muted-foreground">Pomodoros</p>
					</div>
					<div>
						<div className="text-3xl font-bold text-success mb-1">
							{goalsPercentage}%
						</div>
						<p className="text-xs text-muted-foreground">Metas</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
