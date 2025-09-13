import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-zinc-900 text-white p-4">
      <ul className="space-y-2">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
        <li><Link to="/notes">Notes</Link></li>
        <li><Link to="/timer">Timer</Link></li>
      </ul>
    </nav>
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet /> {/* Aqui entram Calendar, Notes, Timer, etc */}
      </main>
    </div>
  )
}
