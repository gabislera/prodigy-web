import { ArrowLeft, Bot, Loader2, Mic, Plus, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

interface NotesHeaderProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	onCreateNote: () => void;
	onOpenAIDialog: () => void;
	isAIGenerating: boolean;
	showBackButton?: boolean;
	onBackToList?: () => void;
}

export function NotesHeader({
	searchQuery,
	onSearchChange,
	onCreateNote,
	onOpenAIDialog,
	isAIGenerating,
	showBackButton = false,
	onBackToList,
}: NotesHeaderProps) {
	const isMobile = useIsMobile();
	const buttonVariant = isMobile ? "ghost" : "default";
	return (
		<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 p-4 border-b border-border/30 w-full bg-background">
			{/* Botões */}
			<div className="flex items-center justify-between md:justify-center md:gap-2 md:order-1">
				{/* Botão de voltar (só no mobile com lógica) */}
				<div className="flex items-center md:hidden">
					{showBackButton && onBackToList && (
						<Button
							onClick={onBackToList}
							size="sm"
							variant="ghost"
							className="gap-2 hover:bg-muted/50"
						>
							<ArrowLeft className="w-4 h-4" />
							<span className="">Voltar</span>
						</Button>
					)}
					{!showBackButton && (
						<h1 className="text-xl font-bold text-white">Notas</h1>
					)}
				</div>

				{/* Botões principais */}
				<div className="flex items-center gap-2">
					{isAIGenerating ? (
						<Loader2 className="size-4 animate-spin text-white" />
					) : (
						<Button
							onClick={onOpenAIDialog}
							size="sm"
							variant="outline"
						>
							<Sparkles className="w-4 h-4" />
						</Button>
					)}
					<Button onClick={onCreateNote} size="sm" variant={buttonVariant} className="bg-primary">
						<Plus />
						<span className="sr-only md:not-sr-only md:ml-2">Nova Nota</span>
					</Button>

				</div>
			</div>

			{/* Searchbar */}
			<div className="relative w-full md:w-auto">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
				<Input
					placeholder="Pesquisar notas..."
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					className="pl-10 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 w-full md:w-auto"
				/>
			</div>
		</div>
	);
}
