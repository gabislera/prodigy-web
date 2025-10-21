import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DailyStreakProps {
	streakDays: number;
}

export function DailyStreak({ streakDays }: DailyStreakProps) {
	return (
		<Card className="bg-card border-border">
			<CardContent className="pt-6">
				<div className="space-y-2">
					<p className="text-sm text-muted-foreground">Sequência Diária</p>
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
							<Flame size={32} className="text-success" />
						</div>
						<div>
							<div className="text-4xl font-bold text-success">{streakDays}</div>
							<p className="text-sm text-muted-foreground">dias</p>
						</div>
					</div>
					<p className="text-sm text-muted-foreground mt-2">
						Continue assim para manter sua sequência!
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
