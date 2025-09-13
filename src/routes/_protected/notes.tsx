import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/notes')({
  component: NotesPage,
})

function NotesPage() {
  return <div>Notas</div>
}
