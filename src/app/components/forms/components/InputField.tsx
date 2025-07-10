import { get, useFormContext, FieldError } from "react-hook-form";
import { tv } from "tailwind-variants";
import { FieldBase } from "../types/fields";
import { Input, InputProps } from "./Input";
import { FieldControl } from "../FieldControl";
import { ErrorMessage } from "./ErrorMessage";
import { Label } from "./Label";
import { ariaInputProps } from "../helpers/aria";

export type InputFieldTypes = "text" | "email" | "password" | "number" | "date" | "time" | "datetime-local";

export type InputFieldProps = FieldBase & InputProps & {
  placeholder?: string;
  type: InputFieldTypes;
}

export function InputField({
  name,
  label,
  placeholder,
  type = "text",
  className,
  validation = {},
  transform,
  disabled
}: InputFieldProps) {

  const { formState: { errors } } = useFormContext();
  const error: FieldError = get(errors, name);
  const hasError: boolean = Boolean(error);
  const isRequired: boolean = Boolean(validation);

  return (
    <div>
      <Label>
        {label} {isRequired && <span className="text-red-800">*</span>}
        <FieldControl name={name} validation={validation} transform={transform}>
          {(fieldProps) => (
            <Input
              {...fieldProps}
              id={name}
              type={type}
              placeholder={placeholder}
              className={className}
              disabled={disabled}
              hasError={hasError}
              aria-invalid={hasError}
              {...ariaInputProps({
                name,
                hasError,
                required: isRequired
              })}
            />
          )}
        </FieldControl>
      </Label>
      <ErrorMessage id={`${name}-error`} message={error?.message} />
    </div>
  );
}