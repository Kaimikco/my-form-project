
/**
 * Directly maps to each custom validator type
 */
export enum ValidatorType {
  FutureOnly = "futureOnly",
  PastOnly = "pastOnly",
}

// Custom validation config
export type CustomValidation = {
  message?: string;
}

export type FutureOnlyConfig = CustomValidation & {}

export type PastOnlyConfig = CustomValidation & {}