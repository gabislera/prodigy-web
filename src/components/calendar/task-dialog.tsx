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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface TaskDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedDate: Date | null;
}

export const TaskDialog = ({
	open,
	onOpenChange,
	selectedDate,
}: TaskDialogProps) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Nova Tarefa</DialogTitle>
				<DialogDescription>
					Criar uma nova tarefa para {selectedDate?.toLocaleDateString("pt-BR")}
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4 py-4">
				<div className="space-y-2">
					<label htmlFor="title" className="text-sm font-medium block">
						Título
					</label>
					<Input id="title" placeholder="Nome da tarefa" />
				</div>
				<div className="space-y-2">
					<label htmlFor="description" className="text-sm font-medium block">
						Descrição
					</label>
					<Textarea id="description" placeholder="Descrição da tarefa..." />
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<label htmlFor="time" className="text-sm font-medium block">
							Horário
						</label>
						<Input id="time" type="time" />
					</div>
					<div className="space-y-2">
						<label htmlFor="duration" className="text-sm font-medium block">
							Duração
						</label>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Duração" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="30min">30 minutos</SelectItem>
								<SelectItem value="1h">1 hora</SelectItem>
								<SelectItem value="2h">2 horas</SelectItem>
								<SelectItem value="custom">Personalizado</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="space-y-2">
					<label htmlFor="type" className="text-sm font-medium block">
						Tipo
					</label>
					<Select>
						<SelectTrigger>
							<SelectValue placeholder="Selecione o tipo" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="meeting">Reunião</SelectItem>
							<SelectItem value="study">Estudo</SelectItem>
							<SelectItem value="work">Trabalho</SelectItem>
							<SelectItem value="personal">Pessoal</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<DialogFooter>
				<Button variant="outline" onClick={() => onOpenChange(false)}>
					Cancelar
				</Button>
				<Button className="bg-gradient-primary border-0">Criar Tarefa</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
