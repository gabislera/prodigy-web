import { Link } from "@tanstack/react-router";
import { Play, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickActions() {
	return (
		<Card className="bg-card border-border">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Zap className="text-secondary/80" size={24} />
					Ações Rápidas
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<Button
					asChild
					className="w-full bg-primary justify-start h-12"
					size="lg"
				>
					<Link to="/timer">
						<Play size={18} className="mr-2" />
						Iniciar Pomodoro
					</Link>
				</Button>
				<Button
					asChild
					variant="outline"
					className="w-full justify-start h-12"
					size="lg"
				>
					<Link to="/tasks">
						<Plus size={18} className="mr-2" />
						Nova Tarefa
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
