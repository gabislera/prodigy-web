import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
} from "@tanstack/react-router";
import {
	Calendar,
	FileText,
	Home,
	LogOut,
	Settings,
	Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export const Route = createFileRoute("/_protected")({
	component: RouteComponent,
});

const navigation = [
	{ name: "Dashboard", href: "/", icon: Home },
	{ name: "Calendário", href: "/calendar", icon: Calendar },
	{ name: "Pomodoro", href: "/timer", icon: Timer },
	{ name: "Notas", href: "/notes", icon: FileText },
	{ name: "Configurações", href: "/settings", icon: Settings },
];

function RouteComponent() {
	const location = useLocation();

	const currentNavItem = navigation.find(
		(item) => item.href === location.pathname,
	);

	return (
		<SidebarProvider>
			<div className="flex h-screen w-full">
				<Sidebar>
					<SidebarHeader>
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-accent rounded-xl flex items-center justify-center">
								<span className="text-xl font-bold text-sidebar-primary-foreground">
									F
								</span>
							</div>
							<div>
								<h1 className="text-xl font-bold text-sidebar-foreground">
									FocusFlow
								</h1>
								<p className="text-xs text-muted-foreground">Produtividade</p>
							</div>
						</div>
					</SidebarHeader>

					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupContent>
								<SidebarMenu>
									{navigation.map((item) => {
										const isActive = item.href === location.pathname;

										return (
											<SidebarMenuItem key={item.name}>
												<SidebarMenuButton asChild isActive={isActive}>
													<Link to={item.href}>
														<item.icon className="h-4 w-4" />
														<span>{item.name}</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>

					<SidebarFooter className="border-t border-sidebar-border p-4">
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									onClick={() => {
										// TODO: Implement logout logic
										console.log("Logout clicked");
									}}
								>
									<LogOut className="h-4 w-4" />
									<span>Sair</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
				</Sidebar>

				<div className="flex-1 flex flex-col">
					<header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
						<div className="flex items-center justify-between px-6 py-4">
							<div className="flex items-center gap-4">
								<SidebarTrigger />
								<h2>{currentNavItem?.name}</h2>
							</div>

							<div className="flex items-center gap-4">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="relative h-10 w-10 rounded-full"
										>
											<Avatar className="w-10">
												<AvatarImage
													src="/diverse-user-avatars.png"
													alt="Avatar"
												/>
												<AvatarFallback className="bg-primary text-primary-foreground">
													U
												</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-56 bg-popover/95 backdrop-blur-sm"
										align="end"
										forceMount
									>
										<div className="flex items-center justify-start gap-2 p-2">
											<div className="flex flex-col space-y-1 leading-none">
												<p className="font-medium text-popover-foreground">
													Usuário
												</p>
												<p className="w-[200px] truncate text-sm text-muted-foreground">
													usuario@email.com
												</p>
											</div>
										</div>
										<DropdownMenuSeparator />
										<DropdownMenuItem className="text-popover-foreground hover:bg-accent/50">
											Perfil
										</DropdownMenuItem>
										<DropdownMenuItem className="text-popover-foreground hover:bg-accent/50">
											Configurações
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem className="text-destructive hover:bg-destructive/10">
											Sair
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</header>

					{/* Page Content */}
					<main className="flex-1">
						<Outlet /> {/* Aqui entram Calendar, Notes, Timer, etc */}
					</main>
				</div>

				{/* <main className="flex-1 p-4 overflow-y-auto">
        </main> */}
			</div>
		</SidebarProvider>
	);
}
