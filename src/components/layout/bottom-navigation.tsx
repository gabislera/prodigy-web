import { Link, useLocation } from "@tanstack/react-router";
import {
	Calendar,
	FileText,
	Home,
	Kanban,
	Settings,
	Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNavigation = () => {
	const location = useLocation();

	const navigation = [
		{ name: "Dashboard", href: "/", icon: Home },
		{ name: "Calendário", href: "/calendar", icon: Calendar },
		{ name: "Tarefas", href: "/tasks", icon: Kanban },
		{ name: "Timer", href: "/timer", icon: Timer },
		{ name: "Notas", href: "/notes", icon: FileText },
		{ name: "Perfil", href: "/profile", icon: Settings },
	];

	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-lg bg-opacity-90 z-50">
			<div className="flex justify-around items-center py-2 px-2">
				{navigation.map((tab) => {
					const Icon = tab.icon;
					const isActive =
						tab.href === "/"
							? location.pathname === "/"
							: location.pathname.startsWith(tab.href);

					return (
						<Link
							key={tab.name}
							to={tab.href}
							className={cn(
								"group flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300",
								"hover:bg-secondary/50 active:scale-95",
								isActive && "bg-primary",
							)}
						>
							<Icon
								size={20}
								className={cn(
									"transition-colors duration-300 text-muted-foreground",
									isActive && "text-white",
								)}
							/>
						</Link>
					);
				})}
			</div>
		</nav>
	);
};
