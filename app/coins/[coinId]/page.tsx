"use client";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { handleImageError, addCommas } from "@/app/components/Utility";
import Link from "next/link";

export default function Coin({ params }: any) {
  const coinId: any = React.use(params);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [coin, setCoin] = useState<any>({});
  const [coinInfo, setCoinInfo] = useState<any>({});
  const [rendered, setRendered] = useState(false);

  const getCoin = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/coins");
      const selectedCoin = data.data.find(
        (coin: any) => coin.id.toString() === coinId.coinId
      );
      if (selectedCoin) {
        setCoin(selectedCoin);
        getCoinInfo(selectedCoin.id);
      }
      //eslint-disable-next-line
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
      setRendered(true);
    }
  };

  const getCoinInfo = async (coinId: number) => {
    try {
      const { data } = await axios.get(`/api/coinsInfo?id=${coinId}`);
      setCoinInfo(data.data);
      //eslint-disable-next-line
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    getCoin();
  }, [params]);

  return (
    <div>
      {loading && <div>Loading. . .</div>}
      {error ? (
        <p>
          The following error has occured: {error}, please try again later. . .
        </p>
      ) : (
        <div>
          {rendered && (
            <div className="mx-32 p-2">
              <div className="flex">
                <div className="p-6 bg-slate-800 rounded-lg w-1/3 mr-72">
                  <div className="flex items-center">
                    <img
                      id="currentPhoto"
                      src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                      alt=""
                      onError={handleImageError}
                      className="h-8 mr-4"
                    />
                    <div>
                      <span className="text-xl">
                        {coin.name} ({coin.symbol})
                      </span>
                      <Link
                        href={{
                          pathname: coinInfo[coinId.coinId]?.urls.website[0],
                        }}
                      >
                        <p className="text-sm">
                          {coinInfo[coinId.coinId]?.urls.website}
                        </p>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-8 flex items-baseline">
                    <span className="text-3xl mr-4">
                      ${addCommas(coin.quote.USD.price)}
                    </span>
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
                  <div className="mt-4">
                    <span className="mr-4">1h change:</span>
                    <span
                      className={
                        coin.quote.USD.percent_change_1h > 0
                          ? "text-green-500 text-lg"
                          : "text-red-600 text-lg"
                      }
                    >
                      $
                      {(
                        (coin.quote.USD.price *
                          coin.quote.USD.percent_change_1h) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-8">
                    <div className="mb-4">
                      <div className="flex justify-between">
                        <div className="flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#11D861"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#11D861"
                            className="h-4 mr-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 15.75 7.5-7.5 7.5 7.5"
                            />
                          </svg>
                          <span>All time high:</span>
                        </div>
                        <span>$108,360</span>
                      </div>
                      <span className="text-sm ml-7">Input date here</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="#E9190F"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="#E9190F"
                          className="h-4 mr-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                        <span>All time low:</span>
                      </div>
                      <span>$88,420</span>
                    </div>
                    <span className="text-sm ml-7">Input date here</span>
                  </div>
                </div>
                <div className="w-1/3">
                  <p>{coinInfo[coinId.coinId]?.description}</p>
                  <div className="mt-16 flex-col flex items-center">
                    <Link
                      href={{
                        pathname:
                          coinInfo[coinId.coinId]?.urls.technical_doc[0],
                      }}
                      className={
                        coinInfo[coinId.coinId]?.urls.technical_doc[0]
                          ? "bg-slate-800 p-4 rounded-md mb-8"
                          : ""
                      }
                    >
                      <span className="bg-slate-800 p-4 rounded-md">
                        {coinInfo[coinId.coinId]?.urls.technical_doc}
                      </span>
                    </Link>
                    <Link
                      href={{
                        pathname:
                          coinInfo[coinId.coinId]?.urls.message_board[0],
                      }}
                      className={
                        coinInfo[coinId.coinId]?.urls.message_board[0]
                          ? "bg-slate-800 p-4 rounded-md mb-8"
                          : ""
                      }
                    >
                      <span>{coinInfo[coinId.coinId]?.urls.message_board}</span>
                    </Link>
                    <Link
                      href={{
                        pathname: coinInfo[coinId.coinId]?.urls.source_code[0],
                      }}
                      className={
                        coinInfo[coinId.coinId]?.urls.source_code[0]
                          ? "bg-slate-800 p-4 rounded-md"
                          : ""
                      }
                    >
                      <span>{coinInfo[coinId.coinId]?.urls.source_code}</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="p-6 bg-slate-800 rounded-lg w-half mt-12 mr-8">
                  <div className="flex justify-between mb-4">
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 mr-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <span>Total Volume:</span>
                    </div>
                    <span>
                      {addCommas(
                        coin.quote.USD.volume_24h / coin.quote.USD.price
                      )}{" "}
                      {coin.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 mr-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <span>Volume 24h:</span>
                    </div>
                    <span>${addCommas(coin.quote.USD.volume_24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 mr-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <span>Volume/Market:</span>
                    </div>
                    <span>
                      {(
                        coin.quote.USD.volume_24h /
                        coin.quote.USD.price /
                        coin.circulating_supply
                      ).toFixed(5)}{" "}
                      {coin.symbol}
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-slate-800 rounded-lg w-half mt-12 mr-8">
                  <div className="flex justify-between mb-4">
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 mr-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <span>Max Supply:</span>
                    </div>{" "}
                    <span>
                      {coin.max_supply
                        ? addCommas(coin.max_supply)
                        : "Infinite"}{" "}
                      {coin.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 mr-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <span>Circulating Supply:</span>
                    </div>
                    <span>
                      {addCommas(coin.circulating_supply)} {coin.symbol}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="p-6 bg-slate-800 rounded-lg w-half mt-12 mr-8">
                  <div className="flex justify-between mb-4">
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 mr-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <span>Market Cap:</span>
                    </div>
                    <span>${addCommas(coin.quote.USD.market_cap)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 mr-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <span>Fully Diluted Valuation:</span>
                    </div>
                    <span>
                      ${addCommas(coin.quote.USD.fully_diluted_market_cap)}
                    </span>
                  </div>
                </div>
                <div className="p-6 rounded-lg w-half mt-12 mr-8"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
