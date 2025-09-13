import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/timer')({
  component: TimerPage,
})

function TimerPage() {
  return <div>Timer</div>
}
