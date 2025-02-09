import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "./components/themeprovider";
import { ModeToggle } from "./components/themeselector";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex mt-4 items-center justify-around mb-8">
            <h3>ZenCoin</h3>
            <div>
              <Link href="/" className="mx-4">
                Home
              </Link>
              <Link href="/portfolio" className="mx-4">
                Portfolio
              </Link>
            </div>
            <input
              type="text"
              placeholder="search..."
              className="mx-4 p-2 rounded-sm"
            />
            <DropdownMenu>USD</DropdownMenu>
            <ModeToggle />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
