import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import {
	Calendar,
	FileText,
	Home,
	Kanban,
	type LucideIcon,
	Timer,
} from "lucide-react";
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

export interface NavigationProps {
	title: string;
	url: string;
	icon: LucideIcon;
}

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
			<SidebarInset className="flex flex-col ">
				<Header navigation={navigation} />
				<main className="flex-1 ">
					<Outlet />
				</main>
				<BottomNavigation navigation={navigation} />
			</SidebarInset>
		</SidebarProvider>
	);
}
