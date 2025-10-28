import { useLocation } from "@tanstack/react-router";
import { Flame, Link, Timer } from "lucide-react";
import { useTimer } from "@/hooks/use-timer";
import type { NavigationProps } from "@/routes/_protected";
import { formatTime } from "@/utils/date-helpers";
import { SidebarTrigger } from "../ui/sidebar";

export const Header = ({ navigation }: { navigation: NavigationProps[] }) => {
	const location = useLocation();
	const timer = useTimer();

	const currentNavItem = navigation.find((item) => {
		if (item.url === "/") {
			return location.pathname === "/";
		}
		return location.pathname.startsWith(item.url);
	});

	const showMiniTimer = timer.isRunning && location.pathname !== "/timer";

	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-6 bg-sidebar sticky top-0 left-0 right-0 z-50  ">
			<SidebarTrigger className="-ml-1 hidden md:block" />
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
	);
};
