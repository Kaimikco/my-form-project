import { ComponentProps } from "react";
import { tv, VariantProps } from "tailwind-variants";

export const cardStyles = tv({
    base: "shadow-md p-4 border-4 border-gray-800",
    variants: {

    }
});

export type Card = VariantProps<typeof cardStyles> & ComponentProps<'div'>;

export function Card({
    children,
    className,
    ...rest
}: Card) {
    return(
        <div {...rest} className={cardStyles({ className })}>
            {children}
        </div>
    )
}