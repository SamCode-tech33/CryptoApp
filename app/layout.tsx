import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "./components/themeprovider";
import { ModeToggle } from "./components/themeselector";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import StoreProvider from "./StoreProvider";

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
          <StoreProvider>
            <div className="mb-8 mt-2">
              <div className="flex items-center justify-between mx-18">
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
            </div>
            {children}
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
