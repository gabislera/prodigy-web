import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import {
	Calendar,
	FileText,
	Home,
	Kanban,
	type LucideIcon,
	Timer,
} from "lucide-react";
import { useEffect } from "react";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { Header } from "@/components/layout/header";
import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";

export interface NavigationProps {
	title: string;
	url: string;
	icon: LucideIcon;
}

export const Route = createFileRoute("/_protected")({
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
	const navigate = useNavigate();
	const { user, logout, isLogoutLoading, isLoadingUser } = useAuth();
	const isMobile = useIsMobile();

	// Redirect to login if not authenticated
	useEffect(() => {
		if (!isLoadingUser && !user) {
			navigate({ to: "/login" });
		}
	}, [user, isLoadingUser, navigate]);

	// const currentNavItem = navigation.find(
	// 	(item) => item.url === location.pathname,
	// );

	// const handleLogout = () => {
	// 	logout();
	// };

	// Show loading state while checking auth
	if (isLoadingUser) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
					<p className="mt-4 text-muted-foreground">Carregando...</p>
				</div>
			</div>
		);
	}

	// Don't render protected content if not authenticated
	if (!user) {
		return null;
	}

	// if (isMobile) {
	// 	return (
	// 		<div className="min-h-screen bg-background text-foreground">
	// 			<main className="relative pb-20">
	// 				<Outlet /> {/* Mobile pages */}
	// 			</main>
	// 			<BottomNavigation navigation={navigation} />
	// 		</div>
	// 	);
	// }

	return (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<SidebarHeader>
					<div className="flex items-center justify-center gap-2 group-data-[collapsible=icon]:hidden">
						<div className="flex items-center justify-center size-7 rounded-md bg-secondary/70 text-primary-foreground font-bold text-lg">
							P
						</div>
						<h2 className="font-bold text-white">Prodigy</h2>
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
				<Header navigation={navigation} />
				<main className="flex-1 ">
					<Outlet />
				</main>
				<BottomNavigation navigation={navigation} />
			</SidebarInset>
		</SidebarProvider>
	);
}
