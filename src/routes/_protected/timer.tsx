import { createFileRoute } from "@tanstack/react-router";
import {
	Brain,
	CheckCircle,
	Coffee,
	Pause,
	Play,
	RotateCcw,
	Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_protected/timer")({
	component: TimerPage,
});

function TimerPage() {
	const [focusTime, setFocusTime] = useState(25);
	const [breakTime, setBreakTime] = useState(5);
	const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
	const [isActive, setIsActive] = useState(false);
	const [isBreak, setIsBreak] = useState(false);
	const [completedPomodoros, setCompletedPomodoros] = useState(0);
	const [settingsOpen, setSettingsOpen] = useState(false);

	const totalTime = isBreak ? breakTime * 60 : focusTime * 60;
	const progress = ((totalTime - timeLeft) / totalTime) * 100;

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isActive && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft((timeLeft) => timeLeft - 1);
			}, 1000);
		} else if (timeLeft === 0) {
			// Timer finished
			if (!isBreak) {
				setCompletedPomodoros((prev) => prev + 1);
				setIsBreak(true);
				setTimeLeft(breakTime * 60);
			} else {
				setIsBreak(false);
				setTimeLeft(focusTime * 60);
			}
			setIsActive(false);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isActive, timeLeft, isBreak, breakTime, focusTime]);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const toggleTimer = () => {
		setIsActive(!isActive);
	};

	const resetTimer = () => {
		setIsActive(false);
		setTimeLeft(isBreak ? breakTime * 60 : focusTime * 60);
	};

	const skipSession = () => {
		setTimeLeft(0);
	};

	return (
		<div className="p-4 pb-24 space-y-6">
			{/* Timer Circle */}
			<Card className="p-8 bg-gradient-card border-border/50 relative">
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-4 right-4 z-10"
					onClick={() => setSettingsOpen(true)}
				>
					<Settings className="h-5 w-5" />
				</Button>
				<div className="relative w-64 h-64 mx-auto">
					{/* Progress Ring */}
					<svg
						className="w-full h-full -rotate-90"
						viewBox="0 0 100 100"
						aria-label="Progress Ring"
					>
						<title>Timer progress ring</title>
						<circle
							cx="50"
							cy="50"
							r="45"
							fill="none"
							stroke="var(--border)"
							strokeWidth="4"
						/>
						<circle
							cx="50"
							cy="50"
							r="45"
							fill="none"
							stroke={isBreak ? "var(--success)" : "var(--primary)"}
							strokeWidth="4"
							strokeLinecap="round"
							strokeDasharray={`${progress * 2.827} ${282.7 - progress * 2.827}`}
							className="transition-all duration-1000 ease-linear"
						/>
					</svg>

					{/* Time Display */}
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<div className="text-4xl font-bold text-foreground tabular-nums">
							{formatTime(timeLeft)}
						</div>
						<div className="text-sm text-muted-foreground mt-2">
							{isBreak ? "pausa" : "foco"}
						</div>
					</div>
				</div>
			</Card>

			{/* Controls */}
			<div className="flex justify-center gap-4">
				<Button
					onClick={toggleTimer}
					size="lg"
					className={cn(
						"h-14 w-14 rounded-full",
						isBreak
							? "bg-gradient-success shadow-success"
							: "bg-gradient-primary shadow-glow",
					)}
				>
					{isActive ? (
						<Pause className="h-6 w-6" />
					) : (
						<Play className="h-6 w-6" />
					)}
				</Button>

				<Button
					onClick={resetTimer}
					variant="outline"
					size="lg"
					className="h-14 w-14 rounded-full border-border/50"
				>
					<RotateCcw className="h-6 w-6" />
				</Button>

				<Button
					onClick={skipSession}
					variant="ghost"
					size="lg"
					className="h-14 w-14 rounded-full"
				>
					<CheckCircle className="h-6 w-6" />
				</Button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4">
				<Card className="p-4 text-center bg-gradient-card border-border/50 flex flex-col items-center justify-center gap-0">
					<div className="text-2xl font-bold text-primary">
						{completedPomodoros}
					</div>
					<p className="text-sm text-muted-foreground">Hoje</p>
				</Card>

				<Card className="p-4 text-center bg-gradient-card border-border/50 flex flex-col items-center justify-center gap-0">
					<div className="text-2xl font-bold text-accent">4</div>
					<p className="text-sm text-muted-foreground">Meta</p>
				</Card>

				<Card className="p-4 text-center bg-gradient-card border-border/50 flex flex-col items-center justify-center gap-0">
					<div className="text-2xl font-bold text-success">24</div>
					<p className="text-sm text-muted-foreground">Semana</p>
				</Card>
			</div>

			{/* Motivational Message */}
			<Card className="p-4 bg-primary/10 border-primary/20">
				<p className="text-center text-sm text-primary font-medium">
					💪 Você está indo bem! Continue focado!
				</p>
			</Card>

			{/* Settings Dialog */}
			<Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Configurações do Pomodoro</DialogTitle>
						<DialogDescription>
							Ajuste os tempos de foco e pausa
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-6 py-4">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label>Tempo de Foco: {focusTime} minutos</Label>
								<Slider
									value={[focusTime]}
									onValueChange={(value) => {
										setFocusTime(value[0]);
										if (!isBreak) setTimeLeft(value[0] * 60);
									}}
									max={60}
									min={15}
									step={5}
									className="w-full"
								/>
							</div>
							<div className="space-y-2">
								<Label>Tempo de Pausa: {breakTime} minutos</Label>
								<Slider
									value={[breakTime]}
									onValueChange={(value) => {
										setBreakTime(value[0]);
										if (isBreak) setTimeLeft(value[0] * 60);
									}}
									max={20}
									min={5}
									step={5}
									className="w-full"
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button onClick={() => setSettingsOpen(false)}>
							Salvar Configurações
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
