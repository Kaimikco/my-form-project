import { z } from "zod/v4";
import { FieldConditions } from "../helpers/conditions";
import { Input } from "../components/Input";
import { ComponentProps } from "react";
import { Fieldset } from "../components/Fieldset";
import { DateInput } from "../components/DateInput";
import { DatetimeInput } from "../components/DatetimeInput";

export interface FormConfig {
  fields: FieldTypes[];
  crossFieldValidations?: CrossFieldValidation[];
}

/**
 * Maps directly to equivalent form components
 */
export enum FieldRendererTypes {
  Input,
  Fieldset,
  DateTime,
  Date,
}

export type FieldRendererFunction = (props: FieldTypes) => React.ReactNode;
export type FieldTypes = InputConfig | FieldsetConfig | DateConfig | DateTimeConfig;
export type StripMeta<T> = Omit<T, "renderer" | keyof FieldConfig>;

/**
 * Used for schema level validation only.
 * This will only validate when the user submits according to Zod / react-hook-form docs
 */
export type CrossFieldValidation = {
  fields: string[]; 
  validate: (values: Record<string, any>) => boolean;
  message: string;
  errorPath: string[];
}

export type FieldBase = {
  name: string;
  label: string;
  hint?: string;
  className?: string;  
}

export type FieldConfig = {
  validator?: z.ZodType<any>;
  conditions?: FieldConditions;
  defaultValue?: unknown;
}

export type InputConfig = FieldConfig & ComponentProps<typeof Input> & {
  renderer: FieldRendererTypes.Input;
}

export type FieldsetConfig = FieldConfig & ComponentProps<typeof Fieldset> & {
  renderer: FieldRendererTypes.Fieldset;
}

export type DateConfig = FieldConfig & ComponentProps<typeof DateInput> & {
  renderer: FieldRendererTypes.Date;
}

export type DateTimeConfig = FieldConfig & ComponentProps<typeof DatetimeInput> & {
  renderer: FieldRendererTypes.DateTime;
}