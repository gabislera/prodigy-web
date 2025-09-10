import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="p-2">
      <h1 className="text-3xl font-bold text-gray-800">Página Principal</h1>
      <p className="mt-4 text-gray-600">
        Bem-vindo à página principal! Esta é a rota principal da aplicação.
      </p>
    </div>
  ),
})
