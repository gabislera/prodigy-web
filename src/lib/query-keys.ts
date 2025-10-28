export const queryKeys = {
	tasks: {
		all: ["tasks"] as const,
		lists: () => [...queryKeys.tasks.all, "list"] as const,
		list: (groupId?: string | null) =>
			[...queryKeys.tasks.lists(), { groupId }] as const,
		details: () => [...queryKeys.tasks.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
	},

	taskGroups: {
		all: ["task-groups"] as const,
		lists: () => [...queryKeys.taskGroups.all, "list"] as const,
		details: () => [...queryKeys.taskGroups.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.taskGroups.details(), id] as const,
		// Deprecated - backward compatibility
		withDetails: ["task-groups-with-details"] as const,
	},

	taskColumns: {
		all: ["task-columns"] as const,
		lists: () => [...queryKeys.taskColumns.all, "list"] as const,
		list: (groupId: string) =>
			[...queryKeys.taskColumns.lists(), { groupId }] as const,
		// Alternative key used in some places
		groupColumns: (groupId: string) => ["group-columns", groupId] as const,
	},

	taskStats: {
		all: ["task-stats"] as const,
	},

	notes: {
		all: ["notes"] as const,
		lists: () => [...queryKeys.notes.all, "list"] as const,
		details: () => [...queryKeys.notes.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.notes.details(), id] as const,
	},

	user: {
		current: ["current-user"] as const,
		profile: ["user-profile"] as const,
	},
} as const;
