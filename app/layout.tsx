"use client";

import "./globals.css";
import { ThemeProvider } from "./components/themeprovider";
import StoreProvider from "./StoreProvider";
import React, { Suspense } from "react";
import { persistor } from "@/lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { Globalheader } from "./components/globalHeader";
import { Stickynav } from "./components/Stickynav";
const Navlinks = React.lazy(() => import("./components/navigation"));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark:bg-slate-900 bg-gray-200 pb-20">
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <StoreProvider>
              <Globalheader />
              <div className="sticky top-0 left-1/2 z-10">
                <Suspense>
                  <Navlinks />
                </Suspense>
              </div>
              {children}
              <Stickynav />
            </StoreProvider>
          </ThemeProvider>
        </PersistGate>
      </body>
    </html>
  );
}
