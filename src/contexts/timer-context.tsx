import {
	createContext,
	type ReactNode,
	useCallback,
	useEffect,
	useState,
} from "react";
import type { TimerContextValue, TimerState } from "@/types/timer";

const STORAGE_KEY = "prodigy-timer-state";
const DEFAULT_FOCUS_DURATION = 25 * 60 * 1000; // 25 minutes

export const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
	// Simple sound function
	const playCompletionSound = useCallback(() => {
		try {
			const AudioContextConstructor =
				window.AudioContext ||
				(window as unknown as { webkitAudioContext: typeof AudioContext })
					.webkitAudioContext;
			const audioContext = new AudioContextConstructor();
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.value = 800;
			oscillator.type = "sine";

			gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(
				0.01,
				audioContext.currentTime + 0.8,
			);

			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + 0.8);
		} catch (error) {
			console.warn("Could not play completion sound:", error);
		}
	}, []);

	const getInitialState = (): TimerState => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);

				// Construct new object with ONLY the 4 fields we need
				const state: TimerState = {
					isRunning: parsed.isRunning ?? false,
					startTime: parsed.startTime ?? null,
					duration: parsed.duration ?? DEFAULT_FOCUS_DURATION,
					focusDuration: parsed.focusDuration ?? DEFAULT_FOCUS_DURATION,
				};

				// If it was running, recalculate based on elapsed time
				if (state.isRunning && state.startTime) {
					const elapsed = Date.now() - state.startTime;
					const remaining = state.duration - elapsed;

					// If time has passed, don't restore as running
					if (remaining <= 0) {
						return {
							isRunning: false,
							startTime: null,
							duration: state.focusDuration,
							focusDuration: state.focusDuration,
						};
					}
				}

				return state;
			}
		} catch (error) {
			console.error("Error loading timer state:", error);
		}

		return {
			isRunning: false,
			startTime: null,
			duration: DEFAULT_FOCUS_DURATION,
			focusDuration: DEFAULT_FOCUS_DURATION,
		};
	};

	const [state, setState] = useState<TimerState>(getInitialState);
	const [timeRemaining, setTimeRemaining] = useState(0);

	// Save to localStorage whenever state changes
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch (error) {
			console.error("Error saving timer state:", error);
		}
	}, [state]);

	// Calculate remaining time based on Date.now()
	const calculateTimeRemaining = useCallback((): number => {
		if (!state.isRunning || !state.startTime) {
			return state.duration;
		}

		const elapsed = Date.now() - state.startTime;
		const remaining = Math.max(0, state.duration - elapsed);
		return remaining;
	}, [state.isRunning, state.startTime, state.duration]);

	// Handle timer completion
	const handleTimerComplete = useCallback(() => {
		// Timer completed
		playCompletionSound();
		setState((prev) => ({
			...prev,
			isRunning: false,
			startTime: null,
			duration: prev.focusDuration,
		}));
	}, [playCompletionSound]);

	// Update UI every 100ms (doesn't affect timer logic)
	useEffect(() => {
		if (!state.isRunning) {
			setTimeRemaining(state.duration);
			return;
		}

		const interval = setInterval(() => {
			const remaining = calculateTimeRemaining();
			setTimeRemaining(remaining);

			// Check if time is up
			if (remaining <= 0) {
				handleTimerComplete();
			}
		}, 100);

		return () => clearInterval(interval);
	}, [
		state.isRunning,
		state.duration,
		calculateTimeRemaining,
		handleTimerComplete,
	]);

	const start = () => {
		setState((prev) => ({
			...prev,
			isRunning: true,
			startTime: Date.now(),
		}));
	};

	const pause = () => {
		const remaining = calculateTimeRemaining();
		setState((prev) => ({
			...prev,
			isRunning: false,
			startTime: null,
			duration: remaining,
		}));
	};

	const reset = () => {
		setState((prev) => ({
			...prev,
			isRunning: false,
			startTime: null,
			duration: prev.focusDuration,
		}));
	};

	const setFocusDuration = (ms: number) => {
		setState((prev) => ({
			...prev,
			focusDuration: ms,
			duration: ms,
		}));
	};

	// Calculate progress (0-100) based on focus duration
	const progress =
		state.focusDuration > 0
			? ((state.focusDuration - timeRemaining) / state.focusDuration) * 100
			: 0;

	const value: TimerContextValue = {
		isRunning: state.isRunning,
		timeRemaining,
		progress,
		focusDuration: state.focusDuration,
		start,
		pause,
		reset,
		setFocusDuration,
	};

	return (
		<TimerContext.Provider value={value}>{children}</TimerContext.Provider>
	);
}
