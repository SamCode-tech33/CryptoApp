"use client";

import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "./components/themeprovider";
import { ModeToggle } from "./components/themeselector";
import { Currency } from "./components/Currency";
import StoreProvider from "./StoreProvider";
import Logo from "./components/Logo";
import { Navlinks, Navsearch } from "./components/svgComps";
import axios from "axios";
import { useState, useEffect } from "react";
import { addCommas, Updownarrow, Defaulticon } from "./components/Utility";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [globalData, setGlobalData] = useState<any>({});

  const getGlobalCoinData = async () => {
    try {
      const { data } = await axios.get("/api/global");
      setGlobalData(data.data);
      //eslint-disable-next-line
    } catch (error) {}
  };

  useEffect(() => {
    getGlobalCoinData();
  }, []);

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
            <div className="bg-slate-800">
              <div className="flex items-center mx-96 justify-around p-1 mb-2">
                <div className="border flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                    />
                  </svg>
                  <div>
                    Coins{" "}
                    {
                      addCommas(
                        Number(globalData.active_cryptocurrencies)
                      ).split(".")[0]
                    }
                  </div>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                    />
                  </svg>
                  <div>
                    Exhange{" "}
                    {addCommas(Number(globalData.markets)).split(".")[0]}
                  </div>
                </div>
                <div className="flex items-center">
                  <Updownarrow
                    coin={globalData.market_cap_change_percentage_24h_usd}
                  />
                  <div>
                    $
                    {(
                      Number(globalData.total_market_cap?.usd) / 1000000000000
                    ).toFixed(2)}{" "}
                    T
                  </div>
                </div>
                <div className="flex items-center">
                  <div>
                    $
                    {(
                      Number(globalData.total_volume?.usd) / 1000000000
                    ).toFixed(2)}
                    B
                  </div>
                  <div className="w-16 h-2 ml-3 rounded-md bg-gray-400">
                    <div
                      className="bg-white h-2 rounded-md"
                      style={{
                        width:
                          Number(
                            globalData.total_volume?.usd /
                              globalData.total_market_cap?.usd
                          ) *
                            64 <
                          7.5
                            ? "8px"
                            : `${
                                Number(
                                  globalData.total_volume?.usd /
                                    globalData.total_market_cap?.usd
                                ) * 64
                              }px`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Defaulticon coin="btc" height="h-6" />
                  <div>
                    {Math.round(Number(globalData.market_cap_percentage?.btc))}%
                  </div>
                  <div className="w-16 h-2 ml-3 rounded-md bg-gray-400">
                    <div
                      className="bg-orange-400 h-2 rounded-md"
                      style={{
                        width: `${Math.round(
                          (Number(globalData.market_cap_percentage?.btc) /
                            100) *
                            64
                        )}px`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Defaulticon coin="eth" height="h-6" />
                  <div></div>
                  {Math.round(Number(globalData.market_cap_percentage?.eth))}%
                  <div className="w-16 h-2 ml-3 rounded-md bg-gray-400">
                    <div
                      className="h-2 rounded-md bg-blue-500"
                      style={{
                        width: `${Math.round(
                          (Number(globalData.market_cap_percentage?.eth) /
                            100) *
                            64
                        )}px`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
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
      </body>
    </html>
  );
}
