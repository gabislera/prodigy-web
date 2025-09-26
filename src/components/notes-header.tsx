import { Bot, Plus, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NotesHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateNote: () => void;
  onOpenAIDialog: () => void;
  isAIGenerating: boolean;
}

export function NotesHeader({
  searchQuery,
  onSearchChange,
  onCreateNote,
  onOpenAIDialog,
  isAIGenerating,
}: NotesHeaderProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-border/30 w-full bg-background">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Pesquisar notas..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
        />
      </div>

      <div className="flex items-center justify-center gap-2">
        {isAIGenerating && (
          <Bot className="size-6 text-zinc-400 animate-pulse mr-2" />
        )}
        <Button
          onClick={onCreateNote}
          size="sm"
          className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Nota
        </Button>
        <Button
          onClick={onOpenAIDialog}
          size="sm"
          className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/20"
          variant="outline"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Gerar com IA
        </Button>
      </div>
    </div>
  );
}
