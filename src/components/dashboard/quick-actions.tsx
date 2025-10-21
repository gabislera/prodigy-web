import { Link } from "@tanstack/react-router";
import { Play, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickActions() {
	return (
		<Card className="bg-card border-border">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Zap className="text-accent" size={20} />
					Ações Rápidas
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<Button
					asChild
					className="w-full bg-primary/20 justify-start h-12"
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
