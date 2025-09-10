import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800"
          activeOptions={{ exact: true }}
          activeProps={{ className: 'font-bold' }}
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-blue-600 hover:text-blue-800"
          activeProps={{ className: 'font-bold' }}
        >
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
