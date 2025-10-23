import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { TimerProvider } from "./contexts/timer-context";

// Create a new router instance
const router = createRouter({ routeTree });

// Create QueryClient instance
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes
			retry: 1,
		},
	},
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<TimerProvider>
				<RouterProvider router={router} />
				<Toaster richColors position="bottom-center" />
			</TimerProvider>
		</QueryClientProvider>
	</StrictMode>,
);
