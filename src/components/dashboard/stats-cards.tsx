import { Activity, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardsProps {
	completed: number;
	inProgress: number;
	today: number;
	efficiency: number;
}

export function StatsCards({
	completed,
	inProgress,
	today,
	efficiency,
}: StatsCardsProps) {
	return (
		<div className="grid gap-4 md:grid-cols-4">
			<Card className="border-border bg-card p-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
						<CheckCircle2 className="h-5 w-5 text-primary-solid" />
					</div>
					<div>
						<p className="text-2xl font-bold text-foreground">{completed}</p>
						<p className="text-xs text-muted-foreground">Concluídas</p>
					</div>
				</div>
			</Card>

			<Card className="border-border bg-card p-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
						<Activity className="h-5 w-5 text-secondary" />
					</div>

					<div>
						<p className="text-2xl font-bold text-foreground">{inProgress}</p>
						<p className="text-xs text-muted-foreground">Em Progresso</p>
					</div>
				</div>
			</Card>

			<Card className="border-border bg-card p-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
						<Calendar className="h-5 w-5 text-primary-solid" />
					</div>
					<div>
						<p className="text-2xl font-bold text-foreground">{today}</p>
						<p className="text-xs text-muted-foreground">Hoje</p>
					</div>
				</div>
			</Card>

			<Card className="border-border bg-card p-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
						<TrendingUp className="h-5 w-5 text-secondary" />
					</div>
					<div>
						<p className="text-2xl font-bold text-foreground">{efficiency}%</p>
						<p className="text-xs text-muted-foreground">Eficiência</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
