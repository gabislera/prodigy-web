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
