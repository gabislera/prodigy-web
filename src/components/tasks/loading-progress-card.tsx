import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LoadingProgressCardProps {
	message: string;
}

export function LoadingProgressCard({ message }: LoadingProgressCardProps) {
	return (
		<Card className="p-6 bg-card/50 border-primary/20">
			<div className="flex items-center gap-3">
				<Loader2 className="animate-spin text-primary" size={24} />
				<div>
					<p className="font-medium text-foreground">{message}</p>
					<p className="text-sm text-muted-foreground">
						Aguarde enquanto processamos sua solicitação
					</p>
				</div>
			</div>
		</Card>
	);
}
