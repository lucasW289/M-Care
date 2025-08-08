// src/app/layout.tsx
import "./globals.css";
import { GeistSans } from "geist/font/sans";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="relative min-h-screen  overflow-x-hidden antialiased">
        {/* Background Layer */}
        <div
          aria-hidden="true"
          className="fixed inset-0 z-0 background-layer"
        />

        {/* Main content above background */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
