import "./globals.css";
import { StyledLink } from "./components/StyledLink";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>
          <main>
            <div>
              <nav className="flex gap-2 p-4">
                {/* Prefetched when the link is hovered or enters the viewport */}
                <StyledLink href="/">Home</StyledLink>
                <StyledLink href="/planets">Planets</StyledLink>
              </nav>
            </div>
            <div className="px-4">
              {children}              
            </div>
          </main>
          <footer>
            <div className="p-4 flex gap-4">          
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
