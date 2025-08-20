import Link from 'next/link';
import { ComponentProps } from 'react';
import { tv, VariantProps } from 'tailwind-variants';
import { buttonStyles } from '../button/Button';

export const linkStyles = tv({
    base: '',
    variants: {
        type: { 
            button: buttonStyles.base
        }
    }
});

export const StyledLink = (props: ComponentProps<typeof Link> & VariantProps<typeof linkStyles>) => {
    return <Link {...props} className={linkStyles({ ...props })}>{props.children}</Link>
}