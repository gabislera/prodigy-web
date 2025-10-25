import type { Task } from "@/types/tasks"

export type CalendarView = "month" | "week" | "day" | "agenda"

export type CalendarEvent = Task & {
  startDate: string
  endDate: string
}

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange"
