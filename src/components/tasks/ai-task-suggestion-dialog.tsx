import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTaskGroups } from "@/hooks/use-task-groups";
import { useTasks } from "@/hooks/use-tasks";
import { tasksService } from "@/services/tasksService";
import type { AITaskPlan } from "@/types/tasks";
import { parseAIResponse } from "@/utils/ai-helpers";
import { AITaskCard } from "./ai-task-card";
import { LoadingProgressCard } from "./loading-progress-card";

interface AITaskSuggestionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	groupId?: string | null;
}

const AI_LOADING_MESSAGES = [
	"Pensando",
	"Criando Tarefas",
	"Otimizando estrutura",
];

export function AITaskSuggestionDialog({
	open,
	onOpenChange,
}: AITaskSuggestionDialogProps) {
	const [message, setMessage] = useState("");
	const [currentLoadingIndex, setCurrentLoadingIndex] = useState(0);
	const [taskPlan, setTaskPlan] = useState<AITaskPlan | null>(null);
	const [isCreating, setIsCreating] = useState(false);

	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: "http://localhost:3333/tasks/generate-ai",
			credentials: "include",
		}),
	});

	const { createTaskGroup } = useTaskGroups();
	const { createTask } = useTasks();

	const isLoading = status === "streaming";

	useEffect(() => {
		if (!isLoading) {
			setCurrentLoadingIndex(0);
			return;
		}

		const interval = setInterval(() => {
			setCurrentLoadingIndex((prev) => {
				if (prev < AI_LOADING_MESSAGES.length - 1) {
					return prev + 1;
				}
				return prev;
			});
		}, 4000);

		return () => clearInterval(interval);
	}, [isLoading]);

	// Extract JSON from the IA response
	useEffect(() => {
		if (status === "ready" && messages.length > 0) {
			const lastMessage = messages[messages.length - 1];
			if (lastMessage.role === "assistant") {
				try {
					// Look for JSON in the response
					const textParts = lastMessage.parts
						.filter((part) => part.type === "text")
						.map((part) => ("text" in part ? part.text : ""))
						.join("");

					const parsed = parseAIResponse<AITaskPlan>(textParts);

					// Validate basic structure
					if (!parsed.group || !parsed.tasks || !Array.isArray(parsed.tasks)) {
						throw new Error("Estrutura de JSON inválida");
					}

					// Add selected property to all tasks
					parsed.tasks = parsed.tasks.map((task) => ({
						...task,
						selected: true,
					}));

					setTaskPlan(parsed);
				} catch (error) {
					console.error("Erro ao parsear JSON:", error);
					toast.error("Erro ao processar resposta da IA");
				}
			}
		}
	}, [messages, status]);

	const handleSend = () => {
		if (!message.trim() || isLoading) return;

		setTaskPlan(null);
		setCurrentLoadingIndex(0);
		sendMessage({ text: message });
		setMessage("");
	};

	const toggleTaskSelection = (index: number) => {
		if (!taskPlan) return;
		setTaskPlan({
			...taskPlan,
			tasks: taskPlan.tasks.map((task, i) =>
				i === index ? { ...task, selected: !task.selected } : task,
			),
		});
	};

	const handleAddTasks = async () => {
		if (!taskPlan) return;

		setIsCreating(true);
		try {
			const group = await createTaskGroup({
				name: taskPlan.group.name,
				description: taskPlan.group.description,
			});

			// 2. Get the automatically created columns
			const columns = await tasksService.getGroupColumns(group.id);
			const firstColumnId = columns[0]?.id;

			if (!firstColumnId) {
				throw new Error("Não foi possível obter as colunas do grupo");
			}

			// 3. Create the selected tasks in the first column
			const selectedTasks = taskPlan.tasks.filter((task) => task.selected);

			await Promise.all(
				selectedTasks.map((task) =>
					createTask({
						title: task.title,
						description: task.description || "",
						priority: task.priority,
						position: task.position,
						columnId: firstColumnId,
						completed: false,
						startDate: task.startDate,
						endDate: task.endDate,
					}),
				),
			);

			toast.success(
				`Plano criado com sucesso! ${selectedTasks.length} tarefas adicionadas.`,
			);
			onOpenChange(false);
			setTaskPlan(null);
			setMessage("");
		} catch (error) {
			console.error("Erro ao criar plano:", error);
			toast.error("Erro ao criar plano de tarefas");
		} finally {
			setIsCreating(false);
		}
	};

	const showTaskPlan = taskPlan && !isLoading;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl h-[700px] flex flex-col">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						Assistente de IA para Tarefas
					</DialogTitle>
				</DialogHeader>

				<div className="flex-1 flex flex-col min-h-0">
					{showTaskPlan && (
						<div className="flex-1 flex flex-col min-h-0">
							<ScrollArea className="flex-1 pr-4">
								<div className="space-y-2">
									{taskPlan.tasks.map((task, index) => (
										<AITaskCard
											key={`task-${task.title}-${index}`}
											task={task}
											onToggle={() => toggleTaskSelection(index)}
										/>
									))}
								</div>
							</ScrollArea>

							<div className="flex gap-2 pt-4 mt-4 border-t">
								<Button
									onClick={handleAddTasks}
									className="flex-1 bg-gradient-primary shadow-glow"
									disabled={isCreating}
								>
									{isCreating ? (
										<>
											<Loader2 className="animate-spin mr-2" size={16} />
											Criando Plano...
										</>
									) : (
										"Adicionar Tarefas Selecionadas"
									)}
								</Button>
								<Button
									variant="outline"
									onClick={() => {
										setTaskPlan(null);
										setMessage("");
									}}
									disabled={isCreating}
								>
									Nova Consulta
								</Button>
							</div>
						</div>
					)}

					{!isLoading && !taskPlan && (
						<div className="flex-1 flex items-center justify-center">
							<div className="text-center text-muted-foreground">
								<Sparkles className="mx-auto mb-2" size={24} />
								<p>Descreva o que você quer estudar ou realizar...</p>

								<p className="text-xs mt-1">
									Quanto mais detalhado, melhor será a sugestão da IA.
								</p>
							</div>
						</div>
					)}

					{/* Chat Input */}
					<div className="space-y-4 mb-4">
						<div className="flex gap-2">
							<Input
								placeholder="Descreva o que você quer estudar ou realizar..."
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" && !isLoading && handleSend()
								}
								disabled={isLoading || !!taskPlan}
								className="flex-1"
							/>
							<Button
								onClick={handleSend}
								disabled={isLoading || !message.trim() || !!taskPlan}
								className="bg-gradient-primary shadow-glow"
							>
								{isLoading ? (
									<Loader2 className="animate-spin" size={20} />
								) : (
									<Send size={20} />
								)}
							</Button>
						</div>

						{/* Progress Message */}
						{isLoading && (
							<LoadingProgressCard
								message={AI_LOADING_MESSAGES[currentLoadingIndex]}
							/>
						)}

						{/* Success Message */}
						{showTaskPlan && (
							<Card className="p-4 bg-primary/5 border-primary/20">
								<p className="text-foreground">
									✨ Aqui estão as tarefas sugeridas baseadas no seu pedido.
									Selecione as que deseja adicionar ao seu plano:
								</p>
							</Card>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
