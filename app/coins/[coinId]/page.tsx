"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoins } from "@/lib/coinsSlice";
import { RootState, AppDispatch } from "@/lib/store";
import {
  addCommas,
  Updownarrow,
  Staticarrow,
  Plus,
  Defaulticon,
} from "@/app/components/Utility";
import Link from "next/link";
import axios from "axios";

export default function Coin({ params }: any) {
  const [coinsInfo, setCoinsInfo] = useState<any>({});
  const [coin, setCoin] = useState<any>(null);
  const [loading1, setLoading1] = useState(false);
  const [error1, setError1] = useState(false);
  const [rendered, setRendered] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.coins
  );
  const coinId: any = React.use(params);
  const coinSite = coinsInfo[coinId.coinId];

  const getCoinsInfo = async (coinId: number) => {
    setLoading1(true);
    try {
      const { data } = await axios.get(`/api/coinsInfo?id=${coinId}`);
      setCoinsInfo(data.data);
      //eslint-disable-next-line
    } catch (error) {
      setError1(true);
    }
    setLoading1(false);
  };

  useEffect(() => {
    dispatch(fetchCoins());
    getCoinsInfo(coinId.coinId);
  }, [params]);

  useEffect(() => {
    setCoin(data.find((coin: any) => coin.id.toString() === coinId.coinId));
    if (coin !== null) {
      setRendered(true);
    }
  }, [data]);

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
                    <Defaulticon coin={coin} />
                    <div>
                      <span className="text-xl">
                        {coin.name} ({coin.symbol})
                      </span>
                      <Link
                        href={{
                          pathname: coinSite?.urls.website[0],
                        }}
                      >
                        <p className="text-sm">{coinSite?.urls.website}</p>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-8 flex items-baseline">
                    <span className="text-3xl mr-4">
                      ${addCommas(coin.quote.USD.price)}
                    </span>
                    <Updownarrow coin={coin} />
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
                  <div className="mt-12 pt-12 border-t-2 border-slate-600">
                    <div className="mb-4">
                      <div className="flex justify-between">
                        <div className="flex">
                          <Staticarrow
                            color="#11D861"
                            way="m4.5 15.75 7.5-7.5 7.5 7.5"
                          />
                          <span>All time high:</span>
                        </div>
                        <span>$108,360</span>
                      </div>
                      <span className="text-sm ml-7">Input date here</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex">
                        <Staticarrow
                          color="#E9190F"
                          way="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                        <span>All time low:</span>
                      </div>
                      <span>$88,420</span>
                    </div>
                    <span className="text-sm ml-7">Input date here</span>
                  </div>
                </div>
                {loading1 && <div>loading. . .</div>}
                {error ? (
                  <p>
                    The following error has occured: {error1}, please check
                    again later
                  </p>
                ) : (
                  <div className="w-1/3">
                    <p>{coinSite?.description}</p>
                    <div className="mt-16 flex-col flex items-center">
                      <Link
                        href={{
                          pathname: coinSite?.urls.technical_doc[0],
                        }}
                        className={
                          coinSite?.urls.technical_doc[0]
                            ? "bg-slate-800 p-4 rounded-md mb-8"
                            : ""
                        }
                      >
                        <span className="bg-slate-800 p-4 rounded-md">
                          {coinSite?.urls.technical_doc}
                        </span>
                      </Link>
                      <Link
                        href={{
                          pathname: coinSite?.urls.message_board[0],
                        }}
                        className={
                          coinSite?.urls.message_board[0]
                            ? "bg-slate-800 p-4 rounded-md mb-8"
                            : ""
                        }
                      >
                        <span>{coinSite?.urls.message_board}</span>
                      </Link>
                      <Link
                        href={{
                          pathname: coinSite?.urls.source_code[0],
                        }}
                        className={
                          coinSite?.urls.source_code[0]
                            ? "bg-slate-800 p-4 rounded-md"
                            : ""
                        }
                      >
                        <span>{coinSite?.urls.source_code}</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex">
                <div className="p-6 bg-slate-800 rounded-lg w-half mt-12 mr-8">
                  <div className="flex justify-between mb-4">
                    <div className="flex">
                      <Plus />
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
                      <Plus />
                      <span>Volume 24h:</span>
                    </div>
                    <span>${addCommas(coin.quote.USD.volume_24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex">
                      <Plus />
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
                      <Plus />
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
                      <Plus />
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
                      <Plus />
                      <span>Market Cap:</span>
                    </div>
                    <span>${addCommas(coin.quote.USD.market_cap)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <div className="flex">
                      <Plus />
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
