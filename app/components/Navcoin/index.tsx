"use client";

import { useEffect, useState } from "react";
import { addCommas, Updownarrow, Defaulticon } from "../Utility";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { fetchCoins } from "@/lib/coinsSlice";
import { RootState, AppDispatch } from "@/lib/store";
import { Sevendaygraph } from "../Sevendaygraph";
import { prominent } from "color.js";

export default function Navcoin() {
  const [colors, setColors] = useState<any>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.coins
  );

  const fetchImageColor = async (sym: string) => {
    try {
      const color = await prominent(`/api/icons?sym=${sym}`);
      const extractedColor = `${(color[2] as any[])[0] * 2}, ${
        (color[2] as any[])[1] * 2
      }, ${(color[2] as any[])[2] * 2}`;
      setColors((prevColors: string[]) => [...prevColors, extractedColor]);
      //eslint-disable-next-line
    } catch (error) {
      setColors((prevColors: string[]) => [...prevColors, "213 176 29"]);
    }
  };

  const allImageFetch = async () => {
    data.map((coin) => fetchImageColor(coin.symbol.toLowerCase()));
  };

  useEffect(() => {
    dispatch(fetchCoins());
  }, [dispatch]);

  useEffect(() => {
    if (data.length === 100) {
      allImageFetch();
    }
  }, [data]);

  return (
    <div className="mt-12">
      {error && <p>Something went wrong. Please try again later.</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="mx-18">
          <li className="text-black dark:text-white h-12 flex items-center">
            <div className="w-8 flex justify-center mr-4">
              <span>#</span>
            </div>
            <div className="w-60 flex justify-left mr-4">
              <span>Name</span>
            </div>
            <div className="w-28 flex justify-left">
              <span>Price</span>
            </div>
            <div className="w-24 flex justify-left">
              <span>1h%</span>
            </div>
            <div className="w-24 flex justify-left">
              <span>24h%</span>
            </div>
            <div className="w-32 flex justify-left">
              <span>7d%</span>
            </div>
            <div className="w-96 flex justify-left">
              <span>24h Volume / Market Cap</span>
            </div>
            <div className="w-96 flex justify-left">
              <span>Circulating Coins / Total Supply</span>
            </div>
            <div className="w-48 flex justify-left">
              <span>Last 7d</span>
            </div>
          </li>
          {data.map((coin: any, index: number) => {
            const coinPrice = addCommas(coin.quote.USD.price);
            const volume24 = addCommas(coin.quote.USD.volume_24h / 1000000000);
            const marketCap = addCommas(coin.quote.USD.market_cap / 1000000000);
            const circSupply = addCommas(coin.circulating_supply / 1000000);
            const maxSupply = addCommas(coin.max_supply / 1000000);
            return (
              <Link href={`coins/${coin.id}`} key={coin.id}>
                <li className="dark:bg-slate-800 text-black dark:text-white bg-slate-200 h-14 flex items-center rounded-sm dark:hover:bg-slate-700 bg">
                  <div className="w-8 flex justify-center">
                    <span>{index + 1}</span>
                  </div>
                  <div className="w-64 flex justify-left mr-4 items-center">
                    <Defaulticon coin={coin} />
                    <span>
                      {coin.name} ({coin.symbol})
                    </span>
                  </div>
                  <div className="w-28 flex justify-left">
                    <span>${coinPrice}</span>
                  </div>
                  <div className="w-24 flex justify-left">
                    <Updownarrow coin={coin.quote.USD.percent_change_1h} />
                    <span
                      className={
                        coin.quote.USD.percent_change_1h > 0
                          ? "text-green-500"
                          : "text-red-600"
                      }
                    >
                      {Math.abs(coin.quote.USD.percent_change_1h.toFixed(2))}%
                    </span>
                  </div>
                  <div className="w-24 flex justify-left">
                    <Updownarrow coin={coin.quote.USD.percent_change_24h} />
                    <span
                      className={
                        coin.quote.USD.percent_change_24h > 0
                          ? "text-green-500"
                          : "text-red-600"
                      }
                    >
                      {Math.abs(coin.quote.USD.percent_change_24h.toFixed(2))}%
                    </span>
                  </div>
                  <div className="w-32 flex justify-left">
                    <Updownarrow coin={coin.quote.USD.percent_change_7d} />
                    <span
                      className={
                        coin.quote.USD.percent_change_7d > 0
                          ? "text-green-500"
                          : "text-red-600"
                      }
                    >
                      {Math.abs(coin.quote.USD.percent_change_7d.toFixed(2))}%
                    </span>
                  </div>
                  <div className="w-96 flex justify-left flex-col">
                    <div className="flex w-80 justify-between">
                      <span>${volume24}B</span>
                      <span>${marketCap}B</span>
                    </div>
                    <div
                      className="w-80 h-2 rounded-lg"
                      style={{
                        backgroundColor: `rgba(${colors[index + index]}, 0.5)`,
                      }}
                    >
                      <div
                        className="h-2 rounded-lg"
                        style={{
                          width:
                            coin.quote.USD.volume_24h >
                            coin.quote.USD.market_cap
                              ? "20rem"
                              : `${
                                  (coin.quote.USD.volume_24h /
                                    coin.quote.USD.market_cap) *
                                  100
                                }%`,
                          backgroundColor: `rgba(${colors[index + index]}, 1)`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-96 flex justify-left flex-col">
                    <div className="flex w-80 justify-between">
                      <span>{circSupply}M</span>
                      <span
                        className={
                          maxSupply === 0 ? "text-2xl" : maxSupply + ""
                        }
                      >
                        {maxSupply === 0 ? "∞" : maxSupply + "M"}
                      </span>
                    </div>
                    <div
                      className="w-80 h-2 rounded-lg"
                      style={{
                        backgroundColor: `rgba(${colors[index + index]}, 0.5)`,
                      }}
                    >
                      <div
                        className="h-2 rounded-lg"
                        style={{
                          width:
                            maxSupply === 0
                              ? "0px"
                              : `${
                                  (coin.circulating_supply / coin.max_supply) *
                                  100
                                }%`,
                          backgroundColor: `rgba(${colors[index + index]}, 1)`,
                        }}
                      ></div>
                    </div>
                  </div>
                  {data.length > 0 &&
                    colors.length === data.length * 2 &&
                    coin.symbol === "BTC" && (
                      <Sevendaygraph
                        symbol={coin.symbol.toUpperCase()}
                        sevenDay={
                          coin.quote.USD.percent_change_7d < 0
                            ? "rgb(220 38 38)"
                            : "rgb(34 197 94)"
                        }
                      />
                    )}
                </li>
              </Link>
            );
          })}
        </ul>
      )}
    </div>
  );
}
