"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { addCommas } from "../Utility";
import { handleImageError } from "../Utility";
import Link from "next/link";

export default function Navcoin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [coins, setCoins] = useState<any>([]);

  const getCoins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/coins");
      setCoins(data.data);
      //eslint-disable-next-line
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCoins();
  }, []);

  return (
    <div className="mt-12">
      {error && <p>Something went wrong. Please try again later.</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="mx-16">
          <li className="text-black dark:text-white h-12 flex items-center">
            <div className="w-8 flex justify-center mr-4">
              <span>#</span>
            </div>
            <div className="w-52 flex justify-left mr-4">
              <span>Name</span>
            </div>
            <div className="w-24 flex justify-left">
              <span>Price</span>
            </div>
            <div className="w-24 flex justify-left">
              <span>1h%</span>
            </div>
            <div className="w-24 flex justify-left">
              <span>24h%</span>
            </div>
            <div className="w-24 flex justify-left">
              <span>7d%</span>
            </div>
            <div className="w-48 flex justify-left">
              <span>24h Volume</span>
            </div>
            <div className="w-48 flex justify-left">
              <span>Market Cap</span>
            </div>
            <div className="w-48 flex justify-left">
              <span>Circulating</span>
            </div>
            <div className="w-56 flex justify-left">
              <span>Total Supply</span>
            </div>
            <div className="w-48 flex justify-left">
              <span>Last 7d</span>
            </div>
          </li>
          {coins.map((coin: any, index: number) => {
            const coinPrice = addCommas(coin.quote.USD.price);
            const volume24 = addCommas(coin.quote.USD.volume_24h);
            const marketCap = addCommas(coin.quote.USD.market_cap);
            const circSupply = addCommas(coin.circulating_supply);
            const maxSupply = addCommas(coin.max_supply);
            return (
              <Link href={`coins/${coin.id}`} key={coin.id}>
                <li className="dark:bg-gray-800 text-black dark:text-white bg-slate-200 h-14 flex items-center rounded-sm">
                  <div className="w-8 flex justify-center mr-4">
                    <span>{index + 1}</span>
                  </div>
                  <div className="w-52 flex justify-left mr-4 items-center">
                    <img
                      id="currentPhoto"
                      src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                      alt=""
                      onError={handleImageError}
                      className="h-8 mr-4"
                    />
                    <span>
                      {coin.name} ({coin.symbol})
                    </span>
                  </div>
                  <div className="w-24 flex justify-left">
                    <span>${coinPrice}</span>
                  </div>
                  <div className="w-24 flex justify-left">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={
                        coin.quote.USD.percent_change_1h > 0
                          ? "#11D861"
                          : "#E9190F"
                      }
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke={
                        coin.quote.USD.percent_change_1h > 0
                          ? "#11D861"
                          : "#E9190F"
                      }
                      className="h-4 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={
                          coin.quote.USD.percent_change_1h > 0
                            ? "m4.5 15.75 7.5-7.5 7.5 7.5"
                            : "m19.5 8.25-7.5 7.5-7.5-7.5"
                        }
                      />
                    </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={
                        coin.quote.USD.percent_change_1h > 0
                          ? "#11D861"
                          : "#E9190F"
                      }
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke={
                        coin.quote.USD.percent_change_1h > 0
                          ? "#11D861"
                          : "#E9190F"
                      }
                      className="h-4 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={
                          coin.quote.USD.percent_change_1h > 0
                            ? "m4.5 15.75 7.5-7.5 7.5 7.5"
                            : "m19.5 8.25-7.5 7.5-7.5-7.5"
                        }
                      />
                    </svg>
                    <span
                      className={
                        coin.quote.USD.percent_change_1h > 0
                          ? "text-green-500"
                          : "text-red-600"
                      }
                    >
                      {Math.abs(coin.quote.USD.percent_change_24h.toFixed(2))}%
                    </span>
                  </div>
                  <div className="w-24 flex justify-left">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={
                        coin.quote.USD.percent_change_1h > 0
                          ? "#11D861"
                          : "#E9190F"
                      }
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke={
                        coin.quote.USD.percent_change_1h > 0
                          ? "#11D861"
                          : "#E9190F"
                      }
                      className="h-4 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={
                          coin.quote.USD.percent_change_1h > 0
                            ? "m4.5 15.75 7.5-7.5 7.5 7.5"
                            : "m19.5 8.25-7.5 7.5-7.5-7.5"
                        }
                      />
                    </svg>
                    <span
                      className={
                        coin.quote.USD.percent_change_1h > 0
                          ? "text-green-500"
                          : "text-red-600"
                      }
                    >
                      {Math.abs(coin.quote.USD.percent_change_7d.toFixed(2))}%
                    </span>
                  </div>
                  <div className="w-48 flex justify-left">
                    <span>${volume24}</span>
                  </div>
                  <div className="w-48 flex justify-left">
                    <span>${marketCap}</span>
                  </div>
                  <div className="w-48 flex justify-left">
                    <span>{circSupply}</span>
                  </div>
                  <div className="w-56 flex justify-left">
                    <span>{maxSupply}</span>
                  </div>
                  <div className="bg-slate-700 w-32 h-12 flex-col items-center">
                    <div className="bg-orange-500 h-0.5 mt-6 -rotate-12"></div>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      )}
    </div>
  );
}
