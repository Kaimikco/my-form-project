import { FutureOnlyConfig, PastOnlyConfig } from "../types/validation";

// Future only validator
export const futureOnly = ({
  message = "Date must be in the future"
}: FutureOnlyConfig = {}) => (value: string) => {
  if (!value) return true;
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Invalid date";
  return date > new Date() || message;
};

// Past only validator
export const pastOnly = ({
  message = "Date must be in the past"
}: PastOnlyConfig = {}) => (value: string) => {
  if (!value) return true;
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Invalid date";
  return date < new Date() || message;
};