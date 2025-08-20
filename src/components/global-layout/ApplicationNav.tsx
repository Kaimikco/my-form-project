import { StyledLink } from "../styled-link/StyledLink";

interface ApplicationNavProps {}

export default function ApplicationNav({}: ApplicationNavProps) {
  return (
    <div>
        <nav className="flex gap-2 p-4">
        {/* Prefetched when the link is hovered or enters the viewport */}
        <StyledLink href="/">Home</StyledLink>
        <StyledLink href="/planets">Planets</StyledLink>
        </nav>
    </div>
  )
}