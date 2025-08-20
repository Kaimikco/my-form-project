import { ComponentProps, JSX } from "react";
import { tv, VariantProps } from "tailwind-variants";

const inputStyles = tv({
  base: "w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300",
  variants: {
    hasError: {
      true: "border-red-500 focus:ring-red-500"
    },
    disabled: {
      true: "bg-gray-200 text-gray-400 pointer-events-none"
    }
  }
});

export type InputProps = ComponentProps<'input'> & VariantProps<typeof inputStyles> & {}

export function Input(props: InputProps): JSX.Element {

  const { className, hasError, disabled, ...rest } = props;

  return(
      <input className={inputStyles({className, hasError, disabled })} disabled={disabled} {...rest} />
  )
}