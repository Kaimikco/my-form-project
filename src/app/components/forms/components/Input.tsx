import { get, useFormContext } from "react-hook-form";
import { tv } from "tailwind-variants";
import { FieldBase } from "../types/form";

export type InputTypes = "text" | "email" | "password" | "number" | "date" | "time" | "datetime-local";

export type InputProps = FieldBase & {
  placeholder?: string;
  type: InputTypes;
}

const inputStyles = tv({
  base: "w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300",
  variants: {
    error: {
      true: "border-red-500 focus:ring-red-500"
    }
  },
  slots: {
    label: "block text-sm font-medium text-gray-700 mb-1",
    error: "p-2 bg-red-100 text-red-600 text-sm mt-2 rounded-md"
  }
})

export function Input({
  name,
  label,
  placeholder,
  type = "text",
  className
}: InputProps) {
  const { register, formState: { errors }} = useFormContext();
  const error = get(errors, name);

  const { label: labelStyles, base, error: errorStyles} = inputStyles();

  return (
    <div>
      <label htmlFor={name} className={labelStyles()}>
        {label}
        <input
          {...register(name)}
          id={name}
          type={type}
          placeholder={placeholder}
          className={base({ error: Boolean(error), className })}
        />
      </label>
      {error && (
        <p className={errorStyles()}>
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
}