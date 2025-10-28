import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { NavigationProps } from "@/routes/_protected";

export const BottomNavigation = ({
	navigation,
}: {
	navigation: NavigationProps[];
}) => {
	const location = useLocation();

	return (
		<nav className="sticky bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-lg bg-opacity-90 z-50 md:hidden t-6">
			<div className="flex justify-around items-center py-2 px-2">
				{navigation.map((tab) => {
					const Icon = tab.icon;
					const isActive =
						tab.url === "/"
							? location.pathname === "/"
							: location.pathname.startsWith(tab.url);

					return (
						<Link
							key={tab.title}
							to={tab.url}
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
