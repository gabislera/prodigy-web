import { Pause, Play, RotateCcw, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTimer } from "@/hooks/use-timer";
import { formatTime } from "@/utils/format-time";

export function TimerPage() {
	const timer = useTimer();
	const [settingsOpen, setSettingsOpen] = useState(false);

	const [localFocusMinutes, setLocalFocusMinutes] = useState(
		timer.focusDuration / 60000,
	);

	const toggleTimer = () => {
		if (timer.isRunning) {
			timer.pause();
		} else {
			timer.start();
		}
	};

	const handleSaveSettings = () => {
		timer.setFocusDuration(localFocusMinutes * 60000);
		setSettingsOpen(false);
	};

	return (
		<div className="p-4 pb-24 space-y-6">
			<Card className="p-8 bg-gradient-card border-border/50 relative">
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-4 right-4 z-10"
					onClick={() => setSettingsOpen(true)}
				>
					<Settings className="h-5 w-5" />
				</Button>

				<div className="flex flex-col items-center justify-center">
					<div className="relative w-72 h-72">
						<svg
							className="w-full h-full -rotate-90"
							viewBox="0 0 200 200"
							aria-label="Timer progress circle"
						>
							<title>Progresso do timer: {Math.round(timer.progress)}%</title>
							<circle
								cx="100"
								cy="100"
								r="85"
								fill="none"
								stroke="currentColor"
								strokeWidth="8"
								className="text-border/30"
							/>
							<circle
								cx="100"
								cy="100"
								r="85"
								fill="none"
								stroke="currentColor"
								strokeWidth="8"
								strokeLinecap="round"
								strokeDasharray={`${(timer.progress / 100) * 534.07} 534.07`}
								className="transition-all duration-100 ease-linear text-primary"
							/>
						</svg>

						<div className="absolute inset-0 flex items-center justify-center">
							<div className="text-6xl font-bold text-foreground tabular-nums tracking-tight">
								{formatTime(timer.timeRemaining)}
							</div>
						</div>
					</div>
				</div>
			</Card>

			<div className="space-y-3">
				<div className="flex justify-center gap-4">
					<Button
						onClick={toggleTimer}
						size="lg"
						className="h-14 w-14 rounded-full bg-gradient-primary shadow-glow"
					>
						{timer.isRunning ? (
							<Pause className="h-6 w-6" />
						) : (
							<Play className="h-6 w-6" />
						)}
					</Button>

					<Button
						onClick={timer.reset}
						variant="outline"
						size="lg"
						className="h-14 w-14 rounded-full border-border/50"
					>
						<RotateCcw className="h-6 w-6" />
					</Button>
				</div>
			</div>

			<Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Configurações do Timer</DialogTitle>
						<DialogDescription>Ajuste o tempo de foco</DialogDescription>
					</DialogHeader>
					<div className="grid gap-6 py-4">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label>Tempo de Foco: {localFocusMinutes} minutos</Label>
								<Slider
									value={[localFocusMinutes]}
									onValueChange={(value) => setLocalFocusMinutes(value[0])}
									max={60}
									min={1}
									step={1}
									className="w-full"
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button onClick={handleSaveSettings}>Salvar Configurações</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
