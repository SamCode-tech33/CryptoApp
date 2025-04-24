"use client";

import "./globals.css";
import { ThemeProvider } from "./components/themeprovider";
import StoreProvider from "./StoreProvider";
import React, { Suspense } from "react";
import { persistor } from "@/lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { Globalheader } from "./components/globalHeader";
const Navlinks = React.lazy(() => import("./components/navigation"));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark:bg-slate-950 bg-gray-200">
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
                <Suspense fallback={<div className="loading"></div>}>
                  <Navlinks />
                </Suspense>
              </div>
              {children}
            </StoreProvider>
          </ThemeProvider>
        </PersistGate>
      </body>
    </html>
  );
}
