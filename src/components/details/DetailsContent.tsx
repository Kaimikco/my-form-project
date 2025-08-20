import { tv, type VariantProps } from "tailwind-variants";
import { ComponentProps } from "react";

const detailsContentStyles = tv({
  variants: {
    theme: {
      brandPrimary: "p-4",
      brandSecondary: "p-4"
    }
  }
});

type DetailsContentVariants = VariantProps<typeof detailsContentStyles>;
type DetailsContentProps = DetailsContentVariants & ComponentProps<'div'>;

export const DetailsContent = ({ theme, className, children, ...props }: DetailsContentProps) => {
  return (
    <div
      className={detailsContentStyles({ theme, className })}
      {...props}
    >
      {children}
    </div>
  );
};