import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { ApiTaskGroup } from "@/types/tasks";
import { FilterSection } from "./filter-section";

interface FiltersSidebarProps {
	taskGroupsWithDetails: ApiTaskGroup[];
	selectedGroupIds: string[];
	setSelectedGroupIds: (ids: string[]) => void;
	scheduleFilter: "all" | "scheduled" | "unscheduled";
	setScheduleFilter: (filter: "all" | "scheduled" | "unscheduled") => void;
	completionFilter: "all" | "completed" | "incomplete";
	setCompletionFilter: (filter: "all" | "completed" | "incomplete") => void;
	dateRange: DateRange | undefined;
	setDateRange: (range: DateRange | undefined) => void;
}

export const FiltersSidebar = ({
	taskGroupsWithDetails,
	selectedGroupIds,
	setSelectedGroupIds,
	scheduleFilter,
	setScheduleFilter,
	completionFilter,
	setCompletionFilter,
	dateRange,
	setDateRange,
}: FiltersSidebarProps) => {
	const [groupsOpen, setGroupsOpen] = useState(false);
	const [scheduleOpen, setScheduleOpen] = useState(false);
	const [completionOpen, setCompletionOpen] = useState(false);
	const [dateRangeOpen, setDateRangeOpen] = useState(false);
	const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
		undefined,
	);

	const hasGroupFilter = selectedGroupIds.length > 0;
	const hasScheduleFilter = scheduleFilter !== "all";
	const hasCompletionFilter = completionFilter !== "all";
	const hasDateFilter = !!dateRange?.from;

	const toggleGroupSelection = (groupId: string) => {
		setSelectedGroupIds(
			selectedGroupIds.includes(groupId)
				? selectedGroupIds.filter((id) => id !== groupId)
				: [...selectedGroupIds, groupId],
		);
	};

	const groupOptions = [
		...taskGroupsWithDetails
			.filter((group) => group.name?.toLowerCase() !== "calendar")
			.map((group) => ({
				id: group.id,
				label: group.name || "",
				value: group.id,
			})),
		{
			id: "no-group",
			label: "Sem grupo",
			value: "no-group",
		},
	];

	const scheduleOptions = [
		{ id: "scheduled", label: "Agendadas", value: "scheduled" },
		{ id: "unscheduled", label: "Não agendadas", value: "unscheduled" },
	];

	const completionOptions = [
		{ id: "completed", label: "Concluídas", value: "completed" },
		{ id: "incomplete", label: "Não concluídas", value: "incomplete" },
	];

	return (
		<div className="h-full bg-card rounded-lg border border-border p-4 overflow-y-auto flex flex-col gap-4">
			<div>
				<h2 className="text-lg font-semibold mb-2">Filtros</h2>
			</div>

			<div className="flex-1 overflow-y-auto space-y-2">
				<FilterSection
					title="Grupos"
					isOpen={groupsOpen}
					onToggle={setGroupsOpen}
					hasFilter={hasGroupFilter}
					options={groupOptions}
					selectedValues={selectedGroupIds}
					onSelect={toggleGroupSelection}
					onClear={() => {
						setSelectedGroupIds([]);
						setGroupsOpen(false);
					}}
				/>

				<FilterSection
					title="Agendamento"
					isOpen={scheduleOpen}
					onToggle={setScheduleOpen}
					hasFilter={hasScheduleFilter}
					options={scheduleOptions}
					selectedValues={scheduleFilter !== "all" ? [scheduleFilter] : []}
					onSelect={(value) =>
						setScheduleFilter(value as "scheduled" | "unscheduled")
					}
					onClear={() => {
						setScheduleFilter("all");
						setScheduleOpen(false);
					}}
				/>

				<FilterSection
					title="Status"
					isOpen={completionOpen}
					onToggle={setCompletionOpen}
					hasFilter={hasCompletionFilter}
					options={completionOptions}
					selectedValues={completionFilter !== "all" ? [completionFilter] : []}
					onSelect={(value) =>
						setCompletionFilter(value as "completed" | "incomplete")
					}
					onClear={() => {
						setCompletionFilter("all");
						setCompletionOpen(false);
					}}
				/>

				<div
					className={`border rounded-lg overflow-hidden transition-colors ${
						hasDateFilter ? "border-primary" : ""
					}`}
				>
					<Popover
						open={dateRangeOpen}
						onOpenChange={(open) => {
							setDateRangeOpen(open);
							if (!open) {
								setTempDateRange(undefined);
							} else {
								setTempDateRange(dateRange);
							}
						}}
					>
						<PopoverTrigger asChild>
							<Button
								variant="ghost"
								className="w-full flex items-center justify-between p-2 hover:bg-muted/50 transition-colors h-auto"
							>
								<span className="text-sm font-medium flex items-center gap-1.5">
									<CalendarIcon className="h-3.5 w-3.5" />
									Data
								</span>
								<ChevronDown className="h-3.5 w-3.5" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="range"
								selected={tempDateRange}
								onSelect={setTempDateRange}
								numberOfMonths={1}
								locale={ptBR}
							/>
							<div className="p-2 border-t flex gap-2">
								{hasDateFilter ? (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											setDateRange(undefined);
											setTempDateRange(undefined);
											setDateRangeOpen(false);
										}}
										className="flex-1 h-8 text-xs"
									>
										Limpar filtro
									</Button>
								) : (
									<Button
										variant="default"
										size="sm"
										onClick={() => {
											setDateRange(tempDateRange);
											setDateRangeOpen(false);
										}}
										disabled={!tempDateRange?.from}
										className="flex-1 h-8 text-xs"
									>
										Aplicar
									</Button>
								)}
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</div>
	);
};
