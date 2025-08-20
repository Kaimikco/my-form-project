import { ComponentProps } from "react";
import { FieldConditions } from "../helpers/conditions";
import { InputField } from "../components/InputField";
import { FieldsetField } from "../components/FieldsetField";
import { DateInputField } from "../components/DateInputField";
import { DatetimeInputField } from "../components/DatetimeInputField";
import { RegisterOptions, Validate } from "react-hook-form";

/**
 * Maps directly to equivalent form components
 */
export enum FieldTypes {
	Input,
	Fieldset,
	DateTime,
	Date,
}

export type FieldRendererFunction = (props: Fields) => React.ReactNode;

/**
 * Fields union for correctly typing field arrays using 'renderer' prop as a discriminator
 */
export type Fields = InputConfig | FieldsetConfig | DateConfig | DateTimeConfig;

/**
 * Strip prop types that shouldnt be accessed inside Field components
 */
export type StripMeta<T> = Omit<T, "renderer" | keyof FieldConfig>;

/**
 * Used to transform input data from display (what the user can see) to storage (what is stored in form state)
 */
export type TransformConfig = {
	display: (value: any) => string;
	storage: (value: string) => any;
}

export enum HintType {
	Info,
	Warning
}

export interface FieldBase {
	name: string;
	label: string;
	hint?: {
		collaspible: true;
		type: HintType;
		message: string;
	};
	className?: string;
	validation?: RegisterOptions;
	// For controlled components only
	transform?: TransformConfig;
	
}

export interface FieldConfig {
	conditions?: FieldConditions;
	defaultValue?: unknown;
}

export type InputConfig = FieldConfig & ComponentProps<typeof InputField> & {
	renderer: FieldTypes.Input;
}

export type FieldsetConfig = FieldConfig & ComponentProps<typeof FieldsetField> & {
	renderer: FieldTypes.Fieldset;
}

export type DateConfig = FieldConfig & ComponentProps<typeof DateInputField> & {
	renderer: FieldTypes.Date;
}

export type DateTimeConfig = FieldConfig & ComponentProps<typeof DatetimeInputField> & {
	renderer: FieldTypes.DateTime;
}