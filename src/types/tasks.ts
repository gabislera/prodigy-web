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
	type?: "task" | "event";
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
	description?: string;
	columns: TaskColumn[];
	taskCount: number;
	completedCount: number;
	createdAt: string;
	updatedAt: string;
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
	type?: "task" | "event";
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
	type?: "task" | "event";
}

export interface CreateTaskGroupData {
	id?: string;
	name: string;
	description?: string;
}

export interface UpdateTaskGroupData {
	name?: string;
	description?: string;
}

export interface CreateTaskColumnData {
	groupId: string;
	title: string;
	order: number;
}

export interface UpdateTaskColumnData {
	title: string;
}

export interface AITaskPlan {
	group: {
		name: string;
		description?: string;
	};
	tasks: {
		title: string;
		description: string;
		priority: "high" | "medium" | "low";
		position: number;
		startDate: string;
		endDate: string;
		selected?: boolean;
	}[];
}
