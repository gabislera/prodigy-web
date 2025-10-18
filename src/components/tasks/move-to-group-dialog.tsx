import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { ApiTaskGroup } from "@/types/tasks";

interface MoveToGroupDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	groups: ApiTaskGroup[];
	onMove: (groupId: string, columnId: string) => void;
}

export const MoveToGroupDialog = ({
	isOpen,
	onOpenChange,
	groups,
	onMove,
}: MoveToGroupDialogProps) => {
	const handleSelectGroup = (group: ApiTaskGroup) => {
		if (group.columns.length > 0) {
			onMove(group.id, group.columns[0].id);
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Mover para Grupo</DialogTitle>
					<DialogDescription>
						Selecione um grupo. A tarefa será movida para a primeira coluna do
						grupo selecionado.
					</DialogDescription>
				</DialogHeader>

				<div className="py-4 max-h-[400px] overflow-y-auto">
					{groups.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-8">
							Nenhum grupo disponível
						</p>
					) : (
						<div className="border rounded-lg overflow-hidden">
							{groups.map((group, index) => (
								<button
									key={group.id}
									type="button"
									onClick={() => handleSelectGroup(group)}
									className={`w-full p-3 text-left hover:bg-accent transition-colors ${
										index !== groups.length - 1 ? "border-b" : ""
									}`}
								>
									<span className="font-medium text-sm">{group.name}</span>
								</button>
							))}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};
