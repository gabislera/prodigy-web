import { Edit3, Settings } from "lucide-react";
import { useState } from "react";
import { ProfileEditDialog } from "@/components/profile/profile-edit-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export function ProfilePage() {
	const [isOpen, setIsOpen] = useState(false);
	const { user } = useAuth();

	// const userStats = {
	// 	level: 5,
	// 	xp: 1250,
	// 	streak: 7,
	// 	totalStudyHours: 45,
	// 	completedGoals: 23,
	// 	totalPomodoros: 156,
	// 	averageDaily: 2.1,
	// 	joinDate: "2024-01-01",
	// };

	// const recentAchievements = [
	// 	{ name: "Maratonista", icon: Clock, date: "2024-01-20" },
	// 	{ name: "Sequência de Ferro", icon: Flame, date: "2024-01-22" },
	// 	{ name: "Primeira Meta", icon: Target, date: "2024-01-15" },
	// ];

	// const weeklyStats = [
	// 	{ day: "Seg", hours: 3.5 },
	// 	{ day: "Ter", hours: 2.0 },
	// 	{ day: "Qua", hours: 4.2 },
	// 	{ day: "Qui", hours: 1.5 },
	// 	{ day: "Sex", hours: 3.8 },
	// 	{ day: "Sáb", hours: 2.3 },
	// 	{ day: "Dom", hours: 1.2 },
	// ];

	return (
		<div className="p-4 pb-24 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Perfil</h1>
				<Button variant="ghost" size="icon">
					<Settings className="h-5 w-5" />
				</Button>
			</div>

			{/* User Profile Card */}
			<Card className="p-6 bg-gradient-primary border-0 shadow-glow">
				<div className="flex items-center gap-4">
					<Avatar className="w-20 h-20 border-4 border-white/20">
						<AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=studyapp" />
						<AvatarFallback className="text-2xl bg-white/20 text-primary-foreground">
							ES
						</AvatarFallback>
					</Avatar>

					<div className="flex-1">
						<h2 className="text-xl font-bold text-primary-foreground">
							{user?.name || ""}
						</h2>
						<p className="text-primary-foreground/80 text-sm">{user?.email}</p>

						{/* <div className="flex items-center gap-2 mt-2">
							<Crown className="h-4 w-4 text-primary-foreground" />
							<span className="text-primary-foreground font-medium">
								Nível {userStats.level}
							</span>
						</div> */}
					</div>
					<Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
						<Edit3 className="h-4 w-4" />
						<span className="hidden md:block">Editar</span>
					</Button>
				</div>
			</Card>

			{/* Level Progress */}
			{/* <Card className="p-4 bg-gradient-card border-border/50">
				<div className="flex items-center justify-between mb-3">
					<h3 className="font-semibold flex items-center gap-2">
						<TrendingUp className="h-4 w-4 text-primary" />
						Progresso
					</h3>
					<Badge
						variant="outline"
						className="bg-level/20 text-level border-level/30"
					>
						{userStats.xp} XP
					</Badge>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between text-sm text-muted-foreground">
						<span>Nível {userStats.level}</span>
						<span>Nível {userStats.level + 1}</span>
					</div>
					<div className="w-full bg-secondary rounded-full h-2">
						<div
							className="bg-gradient-primary h-2 rounded-full transition-all duration-1000"
							style={{ width: "70%" }}
						/>
					</div>
					<p className="text-xs text-muted-foreground text-center">
						250 XP para o próximo nível
					</p>
				</div>
			</Card> */}

			{/* Stats Grid */}
			{/* <div className="grid grid-cols-2 gap-4">
				<Card className="p-4 text-center bg-gradient-streak border-0">
					<Flame className="h-6 w-6 mx-auto mb-2 text-white" />
					<div className="text-2xl font-bold text-white">
						{userStats.streak}
					</div>
					<p className="text-white/80 text-sm">Dias de Sequência</p>
				</Card>

				<Card className="p-4 text-center bg-gradient-card border-border/50">
					<Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
					<div className="text-2xl font-bold text-foreground">
						{userStats.totalStudyHours}h
					</div>
					<p className="text-muted-foreground text-sm">Horas Estudadas</p>
				</Card>

				<Card className="p-4 text-center bg-gradient-card border-border/50">
					<Target className="h-6 w-6 mx-auto mb-2 text-success" />
					<div className="text-2xl font-bold text-foreground">
						{userStats.completedGoals}
					</div>
					<p className="text-muted-foreground text-sm">Metas Concluídas</p>
				</Card>

				<Card className="p-4 text-center bg-gradient-card border-border/50">
					<Award className="h-6 w-6 mx-auto mb-2 text-badge" />
					<div className="text-2xl font-bold text-foreground">
						{userStats.totalPomodoros}
					</div>
					<p className="text-muted-foreground text-sm">Pomodoros</p>
				</Card>
			</div> */}

			{/* Weekly Activity */}
			{/* <Card className="p-4 bg-gradient-card border-border/50">
				<h3 className="font-semibold mb-4 flex items-center gap-2">
					<Calendar className="h-4 w-4 text-primary" />
					Atividade Semanal
				</h3>

				<div className="flex justify-between items-end gap-2 h-20">
					{weeklyStats.map((stat, index) => (
						<div key={index} className="flex flex-col items-center flex-1">
							<div className="relative w-full bg-secondary rounded-t">
								<div
									className="bg-gradient-primary rounded-t transition-all duration-1000"
									style={{
										height: `${(stat.hours / 5) * 60}px`,
										minHeight: stat.hours > 0 ? "4px" : "0px",
									}}
								/>
							</div>
							<span className="text-xs text-muted-foreground mt-1">
								{stat.day}
							</span>
						</div>
					))}
				</div>

				<div className="mt-4 text-center">
					<p className="text-sm text-muted-foreground">
						Média diária:{" "}
						<span className="text-primary font-medium">
							{userStats.averageDaily}h
						</span>
					</p>
				</div>
			</Card> */}

			{/* Recent Achievements */}
			{/* <Card className="p-4 bg-gradient-card border-border/50">
				<h3 className="font-semibold mb-4 flex items-center gap-2">
					<Award className="h-4 w-4 text-badge" />
					Conquistas Recentes
				</h3>

				<div className="space-y-3">
					{recentAchievements.map((achievement, index) => (
						<div
							key={index}
							className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
						>
							<div className="p-2 rounded-full bg-badge/20">
								<achievement.icon className="h-4 w-4 text-badge" />
							</div>
							<div className="flex-1">
								<p className="font-medium text-sm">{achievement.name}</p>
								<p className="text-xs text-muted-foreground">
									{new Date(achievement.date).toLocaleDateString("pt-BR")}
								</p>
							</div>
						</div>
					))}
				</div>
			</Card> */}

			{/* Settings Options */}
			{/* <div className="space-y-3">
				<h3 className="font-semibold">Configurações</h3>

				{[
					{ label: "Notificações", icon: Settings },
					{ label: "Preferências de Estudo", icon: BookOpen },
					{ label: "Backup dos Dados", icon: User },
				].map((setting, index) => (
					<Button
						key={index}
						variant="ghost"
						className="w-full justify-start h-12 px-4"
					>
						<setting.icon className="h-4 w-4 mr-3" />
						{setting.label}
					</Button>
				))}

				<Button
					variant="destructive"
					className="w-full justify-start h-12 px-4"
					onClick={() => logout()}
				>
					<LogOut className="h-4 w-4 mr-3" />
					Sair da Conta
				</Button>

        </div> */}
			<ProfileEditDialog isOpen={isOpen} onOpenChange={setIsOpen} />
		</div>
	);
}
