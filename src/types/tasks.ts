export interface Task {
	id: string;
	title: string;
	description: string;
	priority: "high" | "medium" | "low";
}

export interface TaskGroup {
	id: string;
	name: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
	bgColor: string;
	taskCount: number;
	completedCount: number;
}

export interface Column {
	id: string;
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
	bgColor: string;
}

export interface TasksState {
	todo: Task[];
	inProgress: Task[];
	done: Task[];
}
