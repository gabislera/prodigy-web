import { Clock, Pause, Play, RotateCcw, Settings } from "lucide-react";
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
import { useTodayTasks } from "@/hooks/use-today-tasks";
import { formatTime } from "@/utils/date-helpers";

// Predefinições de tempo
const TIMER_PRESETS = {
	FOCUS: { label: "Foco", minutes: 25 },
	SHORT_BREAK: { label: "Pausa Curta", minutes: 5 },
	LONG_BREAK: { label: "Pausa Longa", minutes: 15 },
} as const;

export function TimerPage() {
	const timer = useTimer();
	const [settingsOpen, setSettingsOpen] = useState(false);
	const { data: todayTasks = [] } = useTodayTasks();

	const [localFocusMinutes, setLocalFocusMinutes] = useState(
		timer.focusDuration / 60000,
	);

	// Estado para controlar qual predefinição está selecionada
	const [selectedPreset, setSelectedPreset] = useState<string>("FOCUS");

	const toggleTimer = () => {
		if (timer.isRunning) {
			timer.pause();
		} else {
			timer.start();
		}
	};

	const handlePresetSelect = (presetKey: string, minutes: number) => {
		timer.setFocusDuration(minutes * 60000);
		setSelectedPreset(presetKey);
		timer.reset();
	};

	const handleSaveSettings = () => {
		timer.setFocusDuration(localFocusMinutes * 60000);
		setSelectedPreset("custom");
		setSettingsOpen(false);
	};

	return (
		<div className="p-4 pb-24 space-y-6 grid gap-4 lg:grid-cols-2">
			<Card className="p-8 bg-gradient-card border-border/50 relative h-full">
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-4 right-4 z-10"
					onClick={() => setSettingsOpen(true)}
				>
					<Settings className="h-5 w-5" />
				</Button>

				<div className="flex flex-col items-center justify-center">
					{/* Botões de Predefinição */}
					<div className="flex gap-2 mb-8 flex-wrap justify-center">
						<Button
							variant={selectedPreset === "FOCUS" ? "default" : "outline"}
							size="sm"
							onClick={() =>
								handlePresetSelect("FOCUS", TIMER_PRESETS.FOCUS.minutes)
							}
							disabled={timer.isRunning}
							className="min-w-[100px]"
						>
							{TIMER_PRESETS.FOCUS.label}
						</Button>
						<Button
							variant={selectedPreset === "SHORT_BREAK" ? "default" : "outline"}
							size="sm"
							onClick={() =>
								handlePresetSelect(
									"SHORT_BREAK",
									TIMER_PRESETS.SHORT_BREAK.minutes,
								)
							}
							disabled={timer.isRunning}
							className="min-w-[100px]"
						>
							{TIMER_PRESETS.SHORT_BREAK.label}
						</Button>
						<Button
							variant={selectedPreset === "LONG_BREAK" ? "default" : "outline"}
							size="sm"
							onClick={() =>
								handlePresetSelect(
									"LONG_BREAK",
									TIMER_PRESETS.LONG_BREAK.minutes,
								)
							}
							disabled={timer.isRunning}
							className="min-w-[100px]"
						>
							{TIMER_PRESETS.LONG_BREAK.label}
						</Button>
					</div>

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
				</div>
			</Card>

			<Card className="border-border bg-card">
				<div className="border-b border-border p-6">
					<div className="flex items-center gap-2">
						<Clock className="h-5 w-5 text-muted-foreground" />
						<h2 className="text-lg font-semibold text-foreground">
							Tarefas de Hoje
						</h2>
					</div>
					<p className="mt-1 text-sm text-muted-foreground">
						{todayTasks.length} tarefas de hoje
					</p>
				</div>

				<div className="max-h-[600px] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent">
					<div className="space-y-3">
						{todayTasks
							.sort((a, b) => {
								const aTime = a.startDate ? new Date(a.startDate).getTime() : 0;
								const bTime = b.startDate ? new Date(b.startDate).getTime() : 0;
								return aTime - bTime;
							})
							.map((task) => (
								<div
									key={task.id}
									className="group relative rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
								>
									{/* <div
										className={`absolute left-0 top-0 h-full w-1 rounded-l-lg ${
											task.status === "completed"
												? "bg-foreground/20"
												: task.status === "in-progress"
													? "bg-foreground"
													: "bg-muted"
										}`}
									/> */}

									<div className="pl-3">
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<p className="font-medium text-foreground">
													{task.title}
												</p>
												<p className="mt-1 text-xs text-muted-foreground">
													{task.description}
												</p>
												{(task.startDate || task.endDate) && (
													<div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
														{task.startDate && (
															<span className="flex items-center gap-1">
																<Clock className="h-3 w-3" />
																{task.allDay
																	? "Dia todo"
																	: new Date(task.startDate).toLocaleTimeString(
																			"pt-BR",
																			{ hour: "2-digit", minute: "2-digit" },
																		)}
															</span>
														)}
														{task.endDate &&
															task.startDate !== task.endDate && (
																<span className="flex items-center gap-1">
																	<span>até</span>
																	{task.allDay
																		? "Dia todo"
																		: new Date(task.endDate).toLocaleTimeString(
																				"pt-BR",
																				{ hour: "2-digit", minute: "2-digit" },
																			)}
																</span>
															)}
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			</Card>

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
