import { tv, type VariantProps } from "tailwind-variants";
import { ComponentProps } from "react";

const summaryStyles = tv({
  base: "flex justify-between items-center cursor-pointer select-none focus:outline-none focus:underline",
  variants: {
    theme: {
      brandPrimary: "p-4 hover:bg-gray-200 transition-colors",
      brandSecondary: "p-4 bg-teal-800 hover:bg-teal-700 transition-colors"
    }
  }
});

type SummaryVariants = VariantProps<typeof summaryStyles>;
type SummaryProps = SummaryVariants & ComponentProps<'summary'>;

export const Summary = ({ theme, className, children, ...props }: SummaryProps) => {
  return (
    <summary
      className={summaryStyles({ theme, className })}
      {...props}
    >
      {children}
    </summary>
  );
};