import Link from 'next/link';
import { ComponentProps } from 'react';
import { tv } from 'tailwind-variants';

export const linkStyles = tv({
    base: `
        text-blue-900
        hover:underline
        hover:decoration-4
        focus:text-black 
        outline-0
        focus:bg-yellow-300
        focus:shadow-(--link-shadow)
        focus:no-underline
    `
});

export const StyledLink = (props: ComponentProps<typeof Link>) => {
    return <Link className={linkStyles()} {...props}>{props.children}</Link>
}