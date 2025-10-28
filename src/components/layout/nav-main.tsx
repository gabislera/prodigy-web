import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
	}[];
}) {
	const location = useLocation();

	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => {
					const isActive =
						item.url === "/"
							? location.pathname === "/"
							: location.pathname.startsWith(item.url);

					return (
						<SidebarMenuItem key={item.url}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								isActive={isActive}
								size="default"
							>
								<Link to={item.url}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
