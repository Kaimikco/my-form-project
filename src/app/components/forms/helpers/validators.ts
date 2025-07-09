import { z } from "zod/v4";

type FutureOnlyProps = {
  required?: boolean;
  message?: string;
  requiredMessage?: string;
}

const futureOnly = ({
  required = false,
  message = "Date must be in the future",
  requiredMessage = "Date field is required"
} : FutureOnlyProps = {}) => {
  if (required) {
    return z.coerce.date({
      error: requiredMessage
    }).min(new Date(), message);
  } else {
    return z.union([
      z.coerce.date().min(new Date(), message),
      z.literal("")
    ]);
  }
};

export const validators = {
  futureOnly,
}