import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
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
import { colorOptions, iconOptions } from "@/utils/taskUtils";

interface CreateGroupDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onCreateGroup: (group: { name: string; icon: string; color: string }) => void;
}

export const CreateGroupDialog = ({
	isOpen,
	onOpenChange,
	onCreateGroup,
}: CreateGroupDialogProps) => {
	const [groupName, setGroupName] = useState("");
	const [selectedIcon, setSelectedIcon] = useState("briefcase");
	const [selectedColor, setSelectedColor] = useState("text-blue-500");

	const handleCreate = () => {
		if (!groupName.trim()) return;

		onCreateGroup({
			name: groupName.trim(),
			icon: selectedIcon,
			color: selectedColor,
		});

		setGroupName("");
		setSelectedIcon("briefcase");
		setSelectedColor("text-blue-500");
		onOpenChange(false);
	};

	const selectedIconOption = iconOptions.find(
		(option) => option.value === selectedIcon,
	);
	const selectedColorOption = colorOptions.find(
		(option) => option.value === selectedColor,
	);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Novo Grupo de Tarefas</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-2">
						<Input
							id="group-name"
							placeholder="Ex: Projetos Pessoais"
							value={groupName}
							onChange={(e) => setGroupName(e.target.value)}
						/>
					</div>

					<div className="flex items-center gap-4">
						<div className="space-y-2">
							<Select value={selectedIcon} onValueChange={setSelectedIcon}>
								<SelectTrigger>
									<SelectValue>
										<div className="flex items-center gap-2">
											{selectedIconOption && (
												<selectedIconOption.icon
													className={`h-4 w-4 ${selectedIconOption.color}`}
												/>
											)}
										</div>
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{iconOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<div className="flex items-center gap-2">
												<option.icon className={`h-4 w-4 ${option.color}`} />
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Select value={selectedColor} onValueChange={setSelectedColor}>
								<SelectTrigger>
									<SelectValue>
										<div className="flex items-center gap-2">
											{selectedColorOption && (
												<>
													<div
														className={`w-4 h-4 rounded-full ${selectedColorOption.bgColor} border`}
													/>
													<span>{selectedColorOption.label}</span>
												</>
											)}
										</div>
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{colorOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<div className="flex items-center gap-2">
												<div
													className={`w-4 h-4 rounded-full ${option.bgColor} border`}
												/>
												<span>{option.label}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div
						className={`p-3 border rounded-lg ${selectedColorOption?.bgColor} `}
					>
						<div className="flex items-center gap-2 mb-2">
							{selectedIconOption && (
								<selectedIconOption.icon
									className={`h-4 w-4 ${selectedColor}`}
								/>
							)}
							<span className="text-sm font-medium">
								{groupName || "Nome do Grupo"}
							</span>
						</div>
						<p className="text-xs text-muted-foreground">Preview do grupo</p>
					</div>

					<div className="flex gap-2 pt-2">
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="flex-1"
						>
							Cancelar
						</Button>
						<Button
							onClick={handleCreate}
							disabled={!groupName.trim()}
							className="flex-1 bg-gradient-primary border-0"
						>
							Criar Grupo
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
