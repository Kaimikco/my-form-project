import { tv } from "tailwind-variants";
import { ComponentProps, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { DetailsRoot, DetailsRootVariants } from "./DetailsRoot";
import { Summary } from "./Summary";
import { DetailsContent } from "./DetailsContent";

type DetailsProps = DetailsRootVariants & ComponentProps<'details'> & {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const iconStyles = tv({
  base: "transition-all",
  variants: {
    open: {
      true: "rotate-180"
    },
  }
})

export const Details = ({ 
  title, 
  children, 
  theme, 
  className, 
  open: openProp 
}: DetailsProps) => {
  
  const [open, setIsOpen] = useState<boolean>(openProp || false);

  return (
    <DetailsRoot open={open} onToggle={() => setIsOpen(!open)} theme={theme} className={className}>
      <Summary theme={theme}>
        <span>{title}</span><span><FaChevronDown className={iconStyles({ open })}/></span>
      </Summary>
      <DetailsContent theme={theme}>
        {children}
      </DetailsContent>
    </DetailsRoot>
  )
}