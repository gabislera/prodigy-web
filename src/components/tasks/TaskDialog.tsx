import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@/types/tasks";

interface TaskDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	task?: Task | null;
	columnId?: string;
	onSave: (taskData: {
		title: string;
		description: string;
		priority: string;
		columnId?: string;
	}) => void;
}

export const TaskDialog = ({
	isOpen,
	onOpenChange,
	task,
	columnId,
	onSave,
}: TaskDialogProps) => {
	const [taskData, setTaskData] = useState({
		title: "",
		description: "",
		priority: "medium",
	});

	const isEditMode = !!task;

	useEffect(() => {
		if (task) {
			setTaskData({
				title: task.title,
				description: task.description,
				priority: task.priority,
			});
		} else {
			setTaskData({
				title: "",
				description: "",
				priority: "medium",
			});
		}
	}, [task]);

	const handleSave = () => {
		if (taskData.title.trim()) {
			onSave({
				...taskData,
				columnId: columnId,
			});
			onOpenChange(false);
		}
	};

	const handleCancel = () => {
		if (task) {
			setTaskData({
				title: task.title,
				description: task.description,
				priority: task.priority,
			});
		} else {
			setTaskData({
				title: "",
				description: "",
				priority: "medium",
			});
		}
		onOpenChange(false);
	};

	const isFormValid = taskData.title.trim();

	return (
		<Dialog open={isOpen} onOpenChange={handleCancel}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{isEditMode ? "Editar Tarefa" : "Nova Tarefa"}
					</DialogTitle>
					{!isEditMode && (
						<DialogDescription>
							Adicione uma nova tarefa à sua lista.
						</DialogDescription>
					)}
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="task-title">Título</Label>
						<Input
							id="task-title"
							placeholder="Digite o título da tarefa"
							value={taskData.title}
							onChange={(e) =>
								setTaskData({ ...taskData, title: e.target.value })
							}
							className="font-medium focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="task-description">Descrição</Label>
						<Textarea
							id="task-description"
							placeholder="Descreva os detalhes da tarefa"
							value={taskData.description}
							onChange={(e) =>
								setTaskData({ ...taskData, description: e.target.value })
							}
							rows={isEditMode ? 6 : 4}
							className="resize-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="task-priority">Prioridade</Label>
						<Select
							value={taskData.priority}
							onValueChange={(value) =>
								setTaskData({ ...taskData, priority: value })
							}
						>
							<SelectTrigger
								id="task-priority"
								className="focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="low">Baixa</SelectItem>
								<SelectItem value="medium">Média</SelectItem>
								<SelectItem value="high">Alta</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleCancel}>
						Cancelar
					</Button>
					<Button
						onClick={handleSave}
						disabled={!isFormValid}
						className={isEditMode ? "bg-gradient-primary border-0" : ""}
					>
						{isEditMode ? "Salvar" : "Criar Tarefa"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
