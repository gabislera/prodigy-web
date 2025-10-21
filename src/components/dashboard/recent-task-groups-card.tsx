import { Folder, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ApiTaskGroup } from "@/types/tasks";

interface RecentTaskGroupsCardProps {
	taskGroups: ApiTaskGroup[];
	isLoading: boolean;
	maxGroups?: number;
}

export function RecentTaskGroupsCard({
	taskGroups,
	isLoading,
	maxGroups = 3,
}: RecentTaskGroupsCardProps) {
	const recentGroups = [...taskGroups].reverse().slice(0, maxGroups);

	return (
		<Card className="bg-card border-border">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Target className="text-primary" size={20} />
					Grupos Recentes
				</CardTitle>
				<p className="text-sm text-muted-foreground">
					Seus projetos mais recentes
				</p>
			</CardHeader>
			<CardContent className="space-y-3">
				{isLoading && (
					<div className="text-center py-4">
						<p className="text-xs text-muted-foreground">
							Carregando grupos...
						</p>
					</div>
				)}

				{!isLoading && recentGroups.length === 0 && (
					<div className="text-center py-4">
						<p className="text-xs text-muted-foreground">Nenhum grupo criado</p>
					</div>
				)}

				{!isLoading &&
					recentGroups.length > 0 &&
					recentGroups.map((group) => {
						const progress =
							group.taskCount > 0
								? Math.round((group.completedCount / group.taskCount) * 100)
								: 0;

						return (
							<div
								key={group.id}
								className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-center gap-2 mb-2">
									<Folder className="h-4 w-4 text-accent" />
									<span className="flex-1 text-sm font-medium">
										{group.name}
									</span>
									{progress === 100 && (
										<Badge
											variant="secondary"
											className="bg-success text-success-foreground text-xs px-2 py-0"
										>
											✓
										</Badge>
									)}
								</div>
								<Progress value={progress} className="h-1.5 mb-2" />
								<p className="text-xs text-muted-foreground">
									{group.completedCount} de {group.taskCount} concluídas (
									{progress}%)
								</p>
							</div>
						);
					})}
			</CardContent>
		</Card>
	);
}
