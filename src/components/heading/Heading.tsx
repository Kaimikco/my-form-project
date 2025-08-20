import { tv, type VariantProps } from "tailwind-variants";
import { ComponentProps } from "react";

const headingStyles = tv({
  base: "",
  variants: {
    level: {
      1: "text-4xl font-bold tracking-tight",
      2: "text-3xl font-semibold tracking-tight",
      3: "text-2xl font-semibold",
      4: "text-xl font-semibold",
      5: "text-lg font-medium",
      6: "text-base font-medium",
    },
    color: {
      default: "text-gray-900",
      white: "text-white",
      muted: "text-gray-600",
      primary: "text-blue-600",
      danger: "text-red-600",
    },
  },
  defaultVariants: {
    level: 3,
    color: "default",
  },
});

// Infer the variant props from the tv function
type HeadingVariants = VariantProps<typeof headingStyles>;
type HeadingLevel = NonNullable<HeadingVariants['level']>;

type HeadingProps = HeadingVariants & ComponentProps<`h${HeadingLevel}`>;

export function Heading({
  level = 3,
  color = "default",
  className,
  children,
  ...props
}: HeadingProps) {

  const Component = `h${level}` as const;

  return (
    <Component
      className={headingStyles({ level, color, className })}
      {...props}
    >
      {children}
    </Component>
  );
}