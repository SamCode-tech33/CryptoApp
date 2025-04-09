"use client";

import React, { useEffect, useState, useRef } from "react";
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
  const [copy, setCopy] = useState("");
  const copyNoteRef = useRef<any>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.coins
  );
  const coinId: any = React.use(params);
  const coinSite = coinsInfo[coinId.coinId];
  const currency = useSelector(
    (state: RootState) => state.currency.currencyType
  );
  const currencySymbol = useSelector(
    (state: RootState) => state.currency.currencySymbol
  );

  const handleCopy = (id: string) => {
    if (copyNoteRef.current) {
      clearTimeout(copyNoteRef.current);
    }
    navigator.clipboard.writeText(id);
    setCopy(id);
    copyNoteRef.current = setTimeout(() => setCopy(""), 400);
  };

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
    dispatch(fetchCoins({ start: 1, limit: 400, convert: currency }));
    getCoinsInfo(coinId.coinId);
  }, [dispatch]);

  useEffect(() => {
    if (data.length) {
      setCoin(data.find((coin: any) => coin.id.toString() === coinId.coinId));
    }
  }, [data]);

  return (
    <div>
      {loading && <div className="loading"></div>}
      {error ? (
        <p>
          The following error has occured: {error}, please try again later. . .
        </p>
      ) : (
        <div>
          {coin && (
            <div className="mx-32 p-2">
              <div className="flex">
                <div className="p-7 bg-slate-800 rounded-lg w-1/3 mr-72">
                  <div className="flex items-center">
                    <Defaulticon coin={coin.symbol} height="h-12" />
                    <div>
                      <span className="text-xl">
                        {coin.name} ({coin.symbol})
                      </span>
                      <div className="flex">
                        <Link
                          href={{
                            pathname: coinSite?.urls.website[0],
                          }}
                        >
                          <p className="text-sm">{coinSite?.urls.website}</p>
                        </Link>
                        <button
                          onClick={() => {
                            const id = coinSite?.urls.website;
                            handleCopy(id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 ml-2 p-1 rounded-md hover:bg-slate-600"
                          >
                            <path d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                          </svg>
                          <div
                            className={
                              copy === coinSite?.urls.website
                                ? " bg-slate-600 p-4 absolute z-10 rounded-lg"
                                : "hidden"
                            }
                          >
                            Site Copied!
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex items-baseline">
                    <span className="text-3xl mr-4">
                      {currencySymbol}{" "}
                      {addCommas(coin.quote?.[currency].price) ||
                        addCommas(coin.quote.USD.price)}
                    </span>
                    <Updownarrow
                      coin={
                        coin.quote?.[currency].percent_change_1h ||
                        coin.quote.USD.percent_change_1h
                      }
                    />
                    <span
                      className={
                        coin.quote?.[currency].percent_change_1h > 0
                          ? "text-green-500"
                          : "text-red-600"
                      }
                    >
                      {Math.abs(
                        coin.quote?.[currency].percent_change_1h.toFixed(2)
                      ) ||
                        Math.abs(coin.quote.USD.percent_change_1h.toFixed(2))}
                      %
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="mr-4">1h change:</span>
                    <span
                      className={
                        coin.quote?.[currency].percent_change_1h > 0
                          ? "text-green-500 text-lg"
                          : "text-red-600 text-lg"
                      }
                    >
                      {currencySymbol}{" "}
                      {addCommas(
                        (coin.quote?.[currency].price *
                          coin.quote?.[currency].percent_change_1h) /
                          100
                      ) ||
                        addCommas(
                          (coin.quote.USD.price *
                            coin.quote.USD.percent_change_1h) /
                            100
                        )}
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
                        <span>{currencySymbol} 108,360</span>
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
                      <span>{currencySymbol} 88,420</span>
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
                      <div
                        className={
                          coinSite?.urls.technical_doc[0]
                            ? "bg-slate-800 p-4 rounded-md mb-8"
                            : ""
                        }
                      >
                        <Link
                          href={{
                            pathname: coinSite?.urls.technical_doc[0],
                          }}
                        >
                          <span className="bg-slate-800 p-4 rounded-md">
                            {coinSite?.urls.technical_doc}
                          </span>
                        </Link>
                        <button
                          onClick={() => {
                            const id = coinSite?.urls.technical_doc;
                            handleCopy(id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 ml-2 p-1 rounded-md hover:bg-slate-600"
                          >
                            <path d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                          </svg>
                          <div
                            className={
                              copy === coinSite?.urls.technical_doc
                                ? " bg-slate-600 p-4 absolute z-10 rounded-lg"
                                : "hidden"
                            }
                          >
                            Site Copied!
                          </div>
                        </button>
                      </div>
                      <div
                        className={
                          coinSite?.urls.message_board[0]
                            ? "bg-slate-800 p-4 rounded-md mb-8"
                            : ""
                        }
                      >
                        <Link
                          href={{
                            pathname: coinSite?.urls.message_board[0],
                          }}
                        >
                          <span>{coinSite?.urls.message_board}</span>
                        </Link>
                        <button
                          onClick={() => {
                            const id = coinSite?.urls.message_board;
                            handleCopy(id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 ml-2 p-1 rounded-md hover:bg-slate-600"
                          >
                            <path d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                          </svg>
                          <div
                            className={
                              copy === coinSite?.urls.message_board
                                ? " bg-slate-600 p-4 absolute z-10 rounded-lg"
                                : "hidden"
                            }
                          >
                            Site Copied!
                          </div>
                        </button>
                      </div>
                      <div
                        className={
                          coinSite?.urls.source_code[0]
                            ? "bg-slate-800 p-4 rounded-md"
                            : ""
                        }
                      >
                        <Link
                          href={{
                            pathname: coinSite?.urls.source_code[0],
                          }}
                        >
                          <span>{coinSite?.urls.source_code}</span>
                        </Link>
                        <button
                          onClick={() => {
                            const id = coinSite?.urls.source_code[0];
                            handleCopy(id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 ml-2 p-1 rounded-md hover:bg-slate-600"
                          >
                            <path d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                          </svg>
                          <div
                            className={
                              copy === coinSite?.urls.source_code[0]
                                ? " bg-slate-600 p-4 absolute z-10 rounded-lg"
                                : "hidden"
                            }
                          >
                            Site Copied!
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex">
                <div className="p-6 bg-slate-800 rounded-lg w-half mt-8 mr-8">
                  <div className="flex justify-between mb-4">
                    <div className="flex">
                      <Plus />
                      <span>Total Volume:</span>
                    </div>
                    <span>
                      {addCommas(
                        coin.quote?.[currency].volume_24h /
                          coin.quote?.[currency].price
                      ) ||
                        addCommas(
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
                    <span>
                      {currencySymbol}{" "}
                      {addCommas(coin.quote?.[currency].volume_24h) ||
                        addCommas(coin.quote.USD.volume_24h)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex">
                      <Plus />
                      <span>Volume/Market:</span>
                    </div>
                    <span>
                      {(
                        coin.quote?.[currency].volume_24h /
                        coin.quote?.[currency].price /
                        coin.circulating_supply
                      ).toFixed(5) ||
                        (
                          coin.quote.USD.volume_24h /
                          coin.quote.USD.price /
                          coin.circulating_supply
                        ).toFixed(5)}{" "}
                      {coin.symbol}
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-slate-800 rounded-lg w-half mt-8 mr-8">
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
                <div className="p-6 bg-slate-800 rounded-lg w-half mt-8 mr-8">
                  <div className="flex justify-between mb-4">
                    <div className="flex">
                      <Plus />
                      <span>Market Cap:</span>
                    </div>
                    <span>
                      {currencySymbol}{" "}
                      {addCommas(coin.quote?.[currency].market_cap) ||
                        addCommas(coin.quote.USD.market_cap)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <div className="flex">
                      <Plus />
                      <span>Fully Diluted Valuation:</span>
                    </div>
                    <span>
                      {currencySymbol}{" "}
                      {addCommas(
                        coin.quote?.[currency].fully_diluted_market_cap
                      ) || addCommas(coin.quote.USD.fully_diluted_market_cap)}
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
