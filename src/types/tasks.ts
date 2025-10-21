export interface Task {
	id: string;
	title: string;
	description: string;
	priority: "high" | "medium" | "low";
	columnId: string | null;
	position: number;
	completed: boolean;
	startDate?: string | null;
	endDate?: string | null;
	allDay?: boolean;
	status?: string;
	type?: string;
	createdAt: string;
	updatedAt: string;
}

export interface TaskColumn {
	id: string;
	title: string;
	groupId: string;
	order: number;
	tasks: Task[];
}

export interface TaskGroup {
	id: string;
	name: string;
	columns: TaskColumn[];
	taskCount: number;
	completedCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface ApiTask {
	id: string;
	title: string;
	description: string;
	priority: "high" | "medium" | "low";
	columnId: string | null;
	position: number;
	completed: boolean;
	startDate?: string | null;
	endDate?: string | null;
	allDay?: boolean;
	status?: string;
	type?: string;
	createdAt: string;
	updatedAt: string;
}

export interface ApiTaskColumn {
	id: string;
	title: string;
	groupId: string;
	order: number;
	tasks: ApiTask[];
}

export interface ApiTaskGroup {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	columns: ApiTaskColumn[];
	taskCount: number;
	completedCount: number;
}

export interface CreateTaskData {
	title: string;
	description?: string;
	priority: "high" | "medium" | "low";
	columnId?: string | null;
	position: number;
	completed?: boolean;
	startDate?: string | null;
	endDate?: string | null;
	allDay?: boolean;
	status?: string;
}

export interface UpdateTaskData {
	title?: string;
	description?: string;
	priority?: "high" | "medium" | "low";
	columnId?: string | null;
	position?: number;
	completed?: boolean;
	startDate?: string | null;
	endDate?: string | null;
	allDay?: boolean;
	status?: string;
}

export interface CreateTaskGroupData {
	id?: string;
	name: string;
}

export interface UpdateTaskGroupData {
	name?: string;
}

export interface CreateTaskColumnData {
	groupId: string;
	title: string;
	order: number;
}

export interface TasksState {
	todo: Task[];
	inProgress: Task[];
	done: Task[];
}

export type TasksByColumn = Record<string, Task[]>;
