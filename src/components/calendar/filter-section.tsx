import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

interface FilterOption {
	id: string;
	label: string;
	value: string;
}

interface FilterSectionProps {
	title: string;
	isOpen: boolean;
	onToggle: (open: boolean) => void;
	hasFilter: boolean;
	options: FilterOption[];
	selectedValues: string[];
	onSelect: (value: string) => void;
	onClear: () => void;
	clearLabel?: string;
}

export const FilterSection = ({
	title,
	isOpen,
	onToggle,
	hasFilter,
	options,
	selectedValues,
	onSelect,
	onClear,
	clearLabel = "Limpar filtro",
}: FilterSectionProps) => {
	return (
		<Collapsible
			open={isOpen}
			onOpenChange={onToggle}
			className={`border rounded-lg overflow-hidden transition-colors ${
				hasFilter ? "border-primary" : ""
			}`}
		>
			<CollapsibleTrigger asChild>
				<Button
					variant="ghost"
					className="w-full flex items-center justify-between p-2 hover:bg-muted/50 transition-colors h-auto"
				>
					<span className="text-sm font-medium">{title}</span>
					<ChevronDown
						className={`h-3.5 w-3.5 transition-transform duration-300 ease-in-out ${
							isOpen ? "rotate-180" : ""
						}`}
					/>
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
				<Separator />
				<div className="p-1.5 space-y-0.5">
					{options.map((option) => {
						const isSelected = selectedValues.includes(option.value);
						return (
							<button
								key={option.id}
								type="button"
								onClick={() => onSelect(option.value)}
								className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md hover:bg-muted transition-colors"
							>
								<span className="truncate">{option.label}</span>
								{isSelected && (
									<Check className="h-3 w-3 text-primary shrink-0" />
								)}
							</button>
						);
					})}
					{hasFilter && (
						<Button
							variant="ghost"
							onClick={onClear}
							className="w-full px-2 py-1.5 text-xs text-primary hover:bg-muted rounded-md transition-colors h-auto"
						>
							{clearLabel}
						</Button>
					)}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};
