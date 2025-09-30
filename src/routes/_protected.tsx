import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
} from "@tanstack/react-router";
import {
	Calendar,
	FileText,
	Flame,
	Home,
	Kanban,
	Settings,
	Timer,
	Trophy,
} from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import {
	Sidebar,
	SidebarContent,
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
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_protected")({
	component: RouteComponent,
});

const navigation = [
	{ name: "Dashboard", href: "/", icon: Home },
	{ name: "Calendário", href: "/calendar", icon: Calendar },
	{ name: "Tarefas", href: "/tasks", icon: Kanban },
	{ name: "Pomodoro", href: "/timer", icon: Timer },
	{ name: "Notas", href: "/notes", icon: FileText },
	{ name: "Configurações", href: "/settings", icon: Settings },
];

function RouteComponent() {
	const location = useLocation();

	const currentNavItem = navigation.find(
		(item) => item.href === location.pathname,
	);

	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<div className="min-h-screen bg-background text-foreground">
				<main className="relative pb-20">
					<Outlet /> {/* Mobile pages */}
				</main>
				<BottomNavigation />
			</div>
		);
	}

	return (
		<SidebarProvider>
			<div className="min-h-screen flex w-full bg-background">
				<Sidebar className="border-r border-white/10">
					<SidebarHeader className="border-b border-white/10 p-4">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
								<Trophy className="w-4 h-4 text-white" />
							</div>
							<div className="flex flex-col">
								<h2 className="font-bold text-white">StudyFlow</h2>
								<p className="text-xs text-gray-400">Sua jornada produtiva</p>
							</div>
						</div>
					</SidebarHeader>

					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupContent>
								<SidebarMenu>
									{navigation.map((tab) => {
										const Icon = tab.icon;
										const isActive = tab.href === location.pathname;

										return (
											<SidebarMenuItem key={tab.name}>
												<SidebarMenuButton
													size={"sm"}
													asChild
													isActive={isActive}
													className={cn(
														"px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/5",
														isActive && "bg-gradient-primary",
													)}
												>
													<Link
														to={tab.href}
														className="flex items-center gap-3 "
													>
														<Icon className="h-4 w-4" />
														<span className="font-medium">{tab.name}</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
				</Sidebar>
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-6">
						<SidebarTrigger className="-ml-1" />
						<div className="flex items-center justify-between w-full">
							<h1 className="text-xl font-bold text-white">
								{currentNavItem?.name}
							</h1>
							<div className="flex items-center gap-2 bg-gradient-streak rounded-full px-3 py-1">
								<Flame className="size-4 text-white" />
								<span className="text-sm font-bold text-white">7</span>
							</div>
						</div>
					</header>
					<main className="flex-1 overflow-auto">
						<Outlet /> {/* Desktop pages */}
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
