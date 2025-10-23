import { useContext } from "react";
import { TimerContext } from "@/contexts/timer-context";
import type { TimerContextValue } from "@/types/timer";

export function useTimer(): TimerContextValue {
	const context = useContext(TimerContext);
	if (!context) {
		throw new Error("useTimer must be used within a TimerProvider");
	}
	return context;
}
