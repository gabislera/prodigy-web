import { ptBR } from "date-fns/locale";

// Centralized locale configuration for date-fns
export const dateFnsLocale = ptBR;

// Helper function to format dates with Portuguese locale
export const formatDate = (date: Date, format: string) => {
	const { format: dateFnsFormat } = require("date-fns");
	return dateFnsFormat(date, format, { locale: ptBR });
};
