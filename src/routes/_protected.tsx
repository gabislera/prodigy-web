import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useLocation,
} from "@tanstack/react-router";
import {
	Calendar,
	FileText,
	Flame,
	Home,
	Kanban,
	LogOut,
	Settings,
	Timer,
} from "lucide-react";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTimer } from "@/hooks/use-timer";
import { cn } from "@/lib/utils";
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
	{ name: "Dashboard", href: "/", icon: Home },
	{ name: "Calendário", href: "/calendar", icon: Calendar },
	{ name: "Tarefas", href: "/tasks", icon: Kanban },
	{ name: "Timer", href: "/timer", icon: Timer },
	{ name: "Notas", href: "/notes", icon: FileText },
	{ name: "Perfil", href: "/profile", icon: Settings },
];

function RouteComponent() {
	const location = useLocation();
	const { user, logout, isLogoutLoading } = useAuth();
	const timer = useTimer();

	const currentNavItem = navigation.find((item) => {
		if (item.href === "/") {
			return location.pathname === "/";
		}
		return location.pathname.startsWith(item.href);
	});

	const isMobile = useIsMobile();

	// Mostrar mini contador se timer está rodando e não está na página do timer
	const showMiniTimer = timer.isRunning && location.pathname !== "/timer";

	const handleLogout = () => {
		logout();
	};

	if (isMobile) {
		return (
			<div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
				<main className="flex-1 overflow-hidden pb-20">
					<Outlet /> {/* Mobile pages */}
				</main>
				<BottomNavigation />
			</div>
		);
	}

	return (
		<SidebarProvider>
			<div className="min-h-screen flex w-full bg-background">
				<Sidebar collapsible="icon" className="border-r border-white/10">
					<SidebarHeader className="border-b border-white/10 p-4">
						<div className="flex items-center gap-3">
							{/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
								<Trophy className="w-4 h-4 text-white" />
							</div> */}
							<div className="flex flex-col group-data-[collapsible=icon]:hidden">
								<h2 className="font-bold text-white">Prodigy</h2>
							</div>
						</div>
						{user && (
							<div className="mt-4 p-3 bg-white/5 rounded-lg group-data-[collapsible=icon]:hidden">
								<p className="text-sm text-white font-medium">{user.name}</p>
								<p className="text-xs text-gray-400">{user.email}</p>
							</div>
						)}
					</SidebarHeader>

					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupContent>
								<SidebarMenu>
									{navigation.map((tab) => {
										const Icon = tab.icon;
										const isActive =
											tab.href === "/"
												? location.pathname === "/"
												: location.pathname.startsWith(tab.href);

										return (
											<SidebarMenuItem key={tab.name}>
												<SidebarMenuButton
													size={"sm"}
													asChild
													isActive={isActive}
													tooltip={tab.name}
													className={cn(
														"px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/5",
														"group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:mx-auto",
														"group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0",
														isActive && "!bg-primary/20",
													)}
												>
													<Link
														to={tab.href}
														className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10"
													>
														<Icon className="h-5 w-5 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
														<span className="font-medium group-data-[collapsible=icon]:hidden">
															{tab.name}
														</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>

					<SidebarFooter>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									size={"sm"}
									onClick={handleLogout}
									disabled={isLogoutLoading}
									tooltip={"Sair"}
									className="px-3 py-2 rounded-lg transition-all duration-200 hover:bg-red-500/20 text-red-400 hover:text-red-300"
								>
									<LogOut className="h-5 w-5 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6" />
									<span className="font-medium group-data-[collapsible=icon]:hidden">
										{isLogoutLoading ? "Saindo..." : "Sair"}
									</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
				</Sidebar>
				<SidebarInset className="flex flex-col overflow-hidden">
					<header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-6">
						<SidebarTrigger className="-ml-1" />
						<div className="flex items-center justify-between w-full">
							<h1 className="text-xl font-bold text-white">
								{currentNavItem?.name}
							</h1>
							<div className="flex items-center gap-3">
								{/* Mini Timer - mostra quando timer está rodando e não está na página do timer */}
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

								{/* Streak */}
								<div className="flex items-center gap-2 bg-gradient-streak rounded-full px-3 py-1">
									<Flame className="size-4 text-white" />
									<span className="text-sm font-bold text-white">7</span>
								</div>
							</div>
						</div>
					</header>
					<main className="flex-1 overflow-hidden">
						<Outlet /> {/* Desktop pages */}
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
