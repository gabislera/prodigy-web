export interface TimerState {
	isRunning: boolean;
	startTime: number | null; // Timestamp when started
	duration: number; // Total duration in ms
	focusDuration: number; // Focus duration in ms
}

export interface TimerContextValue {
	// State
	isRunning: boolean;
	timeRemaining: number; // In ms
	progress: number; // 0-100
	focusDuration: number; // In ms

	// Actions
	start: () => void;
	pause: () => void;
	reset: () => void;
	setFocusDuration: (ms: number) => void;
}
