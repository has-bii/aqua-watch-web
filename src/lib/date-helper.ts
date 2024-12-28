import { format } from "date-fns";

export const dateFormat = (date: Date | string): string => format(date, "PPP");
