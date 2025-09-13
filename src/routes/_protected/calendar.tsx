import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/calendar')({
  component: CalendarPage,
})

function CalendarPage() {
  return <div>Calendário</div>
}
