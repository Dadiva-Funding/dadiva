import { format, formatDistanceToNow, isDate } from "date-fns";

export const formatDate = (date?: Date | number) =>
  isDate(date) ? format(date, "dd MMM yyyy") : "";

export const endsIn = (date?: Date | number) =>
  isDate(date) ? formatDistanceToNow(date) : "";
