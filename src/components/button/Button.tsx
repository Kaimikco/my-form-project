import { ComponentProps } from "react";
import { tv, VariantProps } from "tailwind-variants";

export const buttonStyles = tv({
    base: "bg-gray-800 text-xl text-white border-2 py-2 px-4 hover:bg-white hover:text-gray-800 transition-all duration-300 focus:outline-0 focus:ring-4 focus:ring-blue-500"
})

export type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<'button'> & {}

export function Button({
    children,
    ...rest
}: ButtonProps) {
    return(
        <button {...rest} className={buttonStyles({ ...rest })}>{children}</button>
    )
}