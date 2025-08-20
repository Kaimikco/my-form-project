import { tv, VariantProps } from "tailwind-variants";

export const pageHeadingStyles = tv({
    base: "bg-gray-900 py-4 px-2",
    slots: {
        heading: "text-center text-white font-bold text-9xl"
    }
}) 

type PageHeadingProps = VariantProps<typeof pageHeadingStyles> & {
    title: string;
}

export function PageHeading({
    title
}: PageHeadingProps) {
    const { base, heading } = pageHeadingStyles();
    
    return(
      <div className={base()}>
        <h1 className={heading()}>{title}</h1>
      </div>
    )
}