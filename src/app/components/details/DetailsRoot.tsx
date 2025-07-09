import { tv, type VariantProps } from "tailwind-variants";
import { ComponentProps } from "react";

const detailsRootStyles = tv({
  base: "overflow-hidden",
  variants: {
    theme: {
      brandPrimary: "rounded-md shadow-md bg-gray-100",
      brandSecondary: "rounded-lg bg-gray-800 text-white shadow-lg"
    }
  }
});

export type DetailsRootVariants = VariantProps<typeof detailsRootStyles>;
type DetailsRootProps = DetailsRootVariants & ComponentProps<'details'>;

export const DetailsRoot = ({ theme, className, children, ...props }: DetailsRootProps) => {
  return (
    <details
      className={detailsRootStyles({ theme, className })}
      {...props}
    >
      {children}
    </details>
  );
};