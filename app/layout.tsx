"use client";

import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "./components/themeprovider";
import { ModeToggle } from "./components/themeselector";
import { Currency } from "./components/Currency";
import StoreProvider from "./StoreProvider";
import Logo from "./components/Logo";
import { Navlinks, Navsearch } from "./components/svgComps";
import { persistor } from "@/lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { Globalheader } from "./components/globalHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <StoreProvider>
              <Globalheader />
              <div className="mb-8 mt-2">
                <div className="flex items-center justify-between mx-18">
                  <Link href="/">
                    <div className="flex h-4 items-center">
                      <Logo />
                      <h3 className="ml-2">ZenCoin</h3>
                    </div>
                  </Link>
                  <Navlinks />
                  <Navsearch />
                  <div className="flex items-center">
                    <Currency />
                    <ModeToggle />
                  </div>
                </div>
              </div>
              {children}
            </StoreProvider>
          </ThemeProvider>
        </PersistGate>
      </body>
    </html>
  );
}
