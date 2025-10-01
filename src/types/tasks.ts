export interface Task {
	id: string;
	title: string;
	description: string;
	priority: "high" | "medium" | "low";
	columnId: string;
	position: number;
	completed: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface TaskGroup {
	id: string;
	name: string;
	color: string;
	bgColor: string;
	columns: TaskColumn[];
	taskCount?: number;
	completedCount?: number;
}

export interface TaskColumn {
	id: string;
	title: string;
	groupId: string;
	order: number;
	tasks: Task[];
}

export interface TasksState {
	todo: Task[];
	inProgress: Task[];
	done: Task[];
}

export type TasksByColumn = Record<string, Task[]>;
