import {
	BookOpen,
	Briefcase,
	Heart,
	Home,
	Star,
	Target,
	Users,
	Zap,
} from "lucide-react";

export const iconOptions = [
	{
		value: "briefcase",
		icon: Briefcase,
		color: "text-primary",
	},
	{ value: "book", icon: BookOpen, color: "text-accent" },
	{ value: "home", icon: Home, color: "text-success" },
	{ value: "users", icon: Users, color: "text-warning" },
	{
		value: "target",
		icon: Target,
		color: "text-red-500",
	},
	{ value: "heart", icon: Heart, color: "text-pink-500" },
	{ value: "zap", icon: Zap, color: "text-yellow-500" },
	{ value: "star", icon: Star, color: "text-purple-500" },
];

export const colorOptions = [
	{ value: "text-blue-500", label: "Azul", bgColor: "bg-blue-500/10" },
	{ value: "text-violet-500", label: "Roxo", bgColor: "bg-violet-500/10" },
	{ value: "text-emerald-500", label: "Verde", bgColor: "bg-emerald-500/10" },
	{
		value: "text-rose-500",
		label: "Vermelho",
		bgColor: "bg-rose-500/10",
	},
	{ value: "text-pink-500", label: "Rosa", bgColor: "bg-pink-500/10" },
	{ value: "text-yellow-500", label: "Amarelo", bgColor: "bg-yellow-500/10" },
];

export const getPriorityColor = (priority: string) => {
	switch (priority) {
		case "high":
			return "bg-red-500/20 text-red-500 border-red-500/30";
		case "medium":
			return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
		case "low":
			return "bg-green-500/20 text-green-500 border-green-500/30";
		default:
			return "bg-muted/20 text-muted-foreground border-muted/30";
	}
};

export const getProgressBarColor = (textColor: string) => {
	const colorMap: Record<string, string> = {
		"text-blue-500": "bg-blue-500",
		"text-violet-500": "bg-violet-500",
		"text-emerald-500": "bg-emerald-500",
		"text-rose-500": "bg-rose-500",
		"text-pink-500": "bg-pink-500",
		"text-yellow-500": "bg-yellow-500",
		"text-primary": "bg-primary",
		"text-accent": "bg-accent",
		"text-success": "bg-success",
		"text-warning": "bg-warning",
		"text-red-500": "bg-red-500",
		"text-purple-500": "bg-purple-500",
	};

	return colorMap[textColor] || textColor.replace("text-", "bg-");
};
