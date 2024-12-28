import { format } from "date-fns";

export const dateFormat = (date: Date | string): string => format(date, "PPP");

export const hourFormat = (
  date: Date | string,
  formatString?: string,
): string => format(date, formatString ?? "k");
