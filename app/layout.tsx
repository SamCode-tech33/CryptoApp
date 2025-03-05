"use client";

import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "./components/themeprovider";
import { ModeToggle } from "./components/themeselector";
import { Currency } from "./components/Currency";
import StoreProvider from "./StoreProvider";
import Logo from "./components/Logo";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [home, setHome] = useState(true);

  const changeHome = () => {
    setHome(false);
  };

  const backHome = () => {
    setHome(true);
  };

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
                <Link href="/">
                  <div className="flex h-4 items-center">
                    <Logo />
                    <h3 className="ml-2">ZenCoin</h3>
                  </div>
                </Link>
                <div className="flex">
                  <Link
                    href="/"
                    className="mx-6 flex items-center"
                    onClick={backHome}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={home ? "h-6 mr-2" : "text-slate-600 h-6 mr-2"}
                    >
                      <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                      <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                    </svg>

                    <span className={home ? "" : "text-slate-600"}>Home</span>
                  </Link>
                  <Link
                    href="/portfolio"
                    className="mx-6 flex"
                    onClick={changeHome}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={home ? "h-6 mr-2 text-slate-600" : "h-6 mr-2"}
                    >
                      <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
                      <path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" />
                      <path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z" />
                    </svg>

                    <span className={home ? "text-slate-600" : ""}>
                      Portfolio
                    </span>
                  </Link>
                </div>
                <div className="relative w-full max-w-xs">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 p-2 rounded-sm bg-slate-800 text-white focus:outline-none"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex items-center">
                  <Currency />
                  <ModeToggle />
                </div>
              </div>
            </div>
            {children}
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
