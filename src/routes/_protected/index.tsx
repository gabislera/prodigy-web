import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/')({
  component: DashboardHome,
})

function DashboardHome() {
  return <div>Bem-vindo ao Dashboard</div>
}
