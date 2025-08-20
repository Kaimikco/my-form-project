import { ComponentProps } from "react";
import { tv } from "tailwind-variants";

export const labelStyles = tv({
  base: "block text-sm font-medium text-gray-700 mb-1"
})

export type LabelProps = ComponentProps<'label'> & {

}

export function Label({
  children,
  className,
  ...rest
}: LabelProps) {
  return (
    <label className={labelStyles({ className })} {...rest}>{children}</label>
  )
}