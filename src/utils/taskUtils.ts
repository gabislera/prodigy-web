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
		color: "#3B82F6", // blue-500
	},
	{ value: "book", icon: BookOpen, color: "#8B5CF6" }, // violet-500
	{ value: "home", icon: Home, color: "#10B981" }, // emerald-500
	{ value: "users", icon: Users, color: "#F59E0B" }, // amber/yellow-500
	{
		value: "target",
		icon: Target,
		color: "#EF4444", // red-500
	},
	{ value: "heart", icon: Heart, color: "#EC4899" }, // pink-500
	{ value: "zap", icon: Zap, color: "#F59E0B" }, // yellow-500
	{ value: "star", icon: Star, color: "#A855F7" }, // purple-500
];

export const colorOptions = [
	{ value: "#3B82F6", label: "Azul", bgColor: "#3B82F61A" }, // blue-500 @10% alpha
	{ value: "#8B5CF6", label: "Roxo", bgColor: "#8B5CF61A" }, // violet-500
	{ value: "#10B981", label: "Verde", bgColor: "#10B9811A" }, // emerald-500
	{ value: "#F43F5E", label: "Vermelho", bgColor: "#F43F5E1A" }, // rose-500
	{ value: "#EC4899", label: "Rosa", bgColor: "#EC48991A" }, // pink-500
	{ value: "#F59E0B", label: "Amarelo", bgColor: "#F59E0B1A" }, // yellow-500
];

export const getPriorityColor = (
	priority: string,
): { backgroundColor: string; color: string; borderColor: string } => {
	switch (priority) {
		case "high":
			return {
				backgroundColor: "#EF444433", // red-500 @ ~20% alpha
				color: "#EF4444",
				borderColor: "#EF44444D", // ~30% alpha
			};
		case "medium":
			return {
				backgroundColor: "#F59E0B33", // yellow-500 @ ~20%
				color: "#F59E0B",
				borderColor: "#F59E0B4D",
			};
		case "low":
			return {
				backgroundColor: "#10B98133", // emerald-500 @ ~20%
				color: "#10B981",
				borderColor: "#10B9814D",
			};
		default:
			return {
				backgroundColor: "#9CA3AF33", // muted
				color: "#6B7280",
				borderColor: "#9CA3AF4D",
			};
	}
};

export const getProgressBarColor = (colorHex: string) => {
	return colorHex; // already hex
};
