import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="max-w-[1920px] m-auto">
        <div>
          <main className="bg-gray-800">            
            <div className="px-4 pb-16">
              {children}              
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
