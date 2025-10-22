import { Button } from "./button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./dialog";

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string | React.ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm: () => void;
	onCancel?: () => void;
	variant?: "default" | "destructive";
}

export const ConfirmDialog = ({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = "Confirmar",
	cancelLabel = "Cancelar",
	onConfirm,
	onCancel,
	variant = "destructive",
}: ConfirmDialogProps) => {
	const handleCancel = () => {
		onOpenChange(false);
		onCancel?.();
	};

	const handleConfirm = () => {
		onConfirm();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={handleCancel}>
						{cancelLabel}
					</Button>
					<Button variant={variant} onClick={handleConfirm}>
						{confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
