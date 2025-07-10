import { ComponentProps } from "react"
import { tv, VariantProps } from "tailwind-variants"

export const errorStyles = tv({
	base: "p-2 bg-red-100 text-red-600 text-sm mt-2 rounded-md hidden",
  variants: {
    hasError: {
      true: "block"
    }
  }
})

export type ErrorProps = ComponentProps<'p'> & VariantProps<typeof errorStyles> & {
  message?: string;
}

export function ErrorMessage({
	message,
  ...rest
}: ErrorProps) {
    return(
      <p {...rest} className={errorStyles({ hasError: Boolean(message) })}>
        {message}
      </p>
    )
}