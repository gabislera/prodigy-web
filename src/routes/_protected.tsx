import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useLocation,
} from "@tanstack/react-router";
import { Calendar, FileText, Flame, Home, Kanban, Timer } from "lucide-react";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTimer } from "@/hooks/use-timer";
import { formatTime } from "@/utils/date-helpers";

export const Route = createFileRoute("/_protected")({
	beforeLoad: async () => {
		// Check if user is authenticated
		const token = localStorage.getItem("accessToken");
		if (!token) {
			throw redirect({ to: "/login" });
		}

		// Check if token is valid
		try {
			const payload = JSON.parse(atob(token.split(".")[1]));
			const currentTime = Date.now() / 1000;
			if (payload.exp <= currentTime) {
				throw redirect({ to: "/login" });
			}
		} catch {
			throw redirect({ to: "/login" });
		}
	},
	component: RouteComponent,
});

const navigation = [
	{ title: "Dashboard", url: "/", icon: Home },
	{ title: "Calendário", url: "/calendar", icon: Calendar },
	{ title: "Tarefas", url: "/tasks", icon: Kanban },
	{ title: "Timer", url: "/timer", icon: Timer },
	{ title: "Notas", url: "/notes", icon: FileText },
];

function RouteComponent() {
	const location = useLocation();
	const timer = useTimer();

	const currentNavItem = navigation.find((item) => {
		if (item.url === "/") {
			return location.pathname === "/";
		}
		return location.pathname.startsWith(item.url);
	});

	const isMobile = useIsMobile();

	const showMiniTimer = timer.isRunning && location.pathname !== "/timer";

	if (isMobile) {
		return (
			<div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
				<main className="flex-1 overflow-auto pb-20">
					<Outlet />
				</main>
				<BottomNavigation />
			</div>
		);
	}

	return (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<SidebarHeader>
					<div className="flex items-center justify-center gap-2 group-data-[collapsible=icon]:hidden">
						<div className="flex items-center justify-center size-7 rounded-md bg-secondary/70 text-primary-foreground font-bold text-lg">
							D
						</div>
						<h2 className="font-bold text-white">Daily Focus</h2>
					</div>

					<div className="hidden group-data-[collapsible=icon]:flex items-center justify-center">
						<div className="flex items-center justify-center size-8 rounded-md bg-secondary text-primary-foreground font-bold text-lg">
							D
						</div>
					</div>
				</SidebarHeader>
				<SidebarContent>
					<NavMain items={navigation} />
				</SidebarContent>
				<SidebarFooter>
					<NavUser />
				</SidebarFooter>
			</Sidebar>
			<SidebarInset className="flex flex-col overflow-hidden">
				<header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-6 bg-sidebar">
					<SidebarTrigger className="-ml-1" />
					<div className="flex items-center justify-between w-full">
						<h1 className="text-xl font-bold text-white">
							{currentNavItem?.title}
						</h1>
						<div className="flex items-center gap-3">
							{showMiniTimer && (
								<Link
									to="/timer"
									className="flex items-center gap-2 rounded-full px-3 py-1 transition-all duration-200 hover:scale-105 cursor-pointer bg-gradient-primary/20 hover:bg-gradient-primary/30"
								>
									<Timer className="size-4 text-primary" />
									<span className="text-sm font-bold tabular-nums text-primary">
										{formatTime(timer.timeRemaining)}
									</span>
								</Link>
							)}

							<div className="flex items-center gap-2 bg-secondary/70 rounded-full px-3 py-1">
								<Flame className="size-4 text-secondary-solid" />
								<span className="text-sm font-bold text-white">7</span>
							</div>
						</div>
					</div>
				</header>
				<main className="flex-1 overflow-hidden">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
