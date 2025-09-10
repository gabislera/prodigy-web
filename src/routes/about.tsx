import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: () => (
    <div className="p-2">
      <h1 className="text-3xl font-bold text-gray-800">Sobre</h1>
      <p className="mt-4 text-gray-600">
        Esta é a página sobre. Aqui você pode encontrar informações sobre o projeto.
      </p>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-800">Informações do Projeto</h2>
        <ul className="mt-2 text-blue-700">
          <li>• Framework: React + TypeScript</li>
          <li>• Router: TanStack Router</li>
          <li>• Build Tool: Vite</li>
          <li>• Styling: TailwindCSS</li>
        </ul>
      </div>
    </div>
  ),
})
