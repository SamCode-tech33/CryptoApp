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
import axios from "axios";
import { Copy } from "@/app/components/svgComps";

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
            <div className="xl:mx-32 lg:mx-16 md:mx-8 sm:mx-4 mx-2">
              <div className="flex justify-between md:flex-row flex-col">
                <div className="p-7 dark:bg-slate-800 rounded-lg xl:w-1/3 bg-white md:mr-8">
                  <div className="flex items-center">
                    <Defaulticon
                      coin={coin.symbol}
                      height="h-12"
                      margin="mr-2"
                    />
                    <div>
                      <span className="text-xl">
                        {coin.name} ({coin.symbol})
                      </span>
                      <Copy
                        site={coinSite?.urls.website}
                        handleCopy={handleCopy}
                        copy={copy}
                        siteName="https://bitcoin.org/"
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex items-baseline">
                    <span className="text-3xl mr-4">
                      {currencySymbol}
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
                  <div className="md:ml-8 mt-8 md:mt-0 xl:mr-32 2xl:mr-64">
                    <p>{coinSite?.description}</p>
                    <div className="mt-12 text-center max-w-96">
                      {coinSite?.urls.technical_doc[0] && (
                        <div className="dark:bg-slate-800 p-4 rounded-md mb-8 bg-white">
                          <Copy
                            site={coinSite?.urls.technical_doc[0]}
                            handleCopy={handleCopy}
                            copy={copy}
                            siteName="https://bitcoin.org/bitcoin.pdf"
                          />
                        </div>
                      )}
                      {coinSite?.urls.message_board[0] && (
                        <div className="dark:bg-slate-800 p-4 rounded-md mb-8 bg-white">
                          <Copy
                            site={coinSite?.urls.message_board[0]}
                            handleCopy={handleCopy}
                            copy={copy}
                            siteName="https://bitcointalk.org"
                          />
                        </div>
                      )}
                      {coinSite?.urls.source_code[0] && (
                        <div className="dark:bg-slate-800 p-4 rounded-md mb-8 bg-white">
                          <Copy
                            site={coinSite?.urls.source_code[0]}
                            handleCopy={handleCopy}
                            copy={copy}
                            siteName="https://github.com/bitcoin/bitcoin"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex lg:flex-row flex-col lg:text-base text-xs">
                <div className="p-6 dark:bg-slate-800 rounded-lg w-full mt-8 mr-8 bg-white">
                  <div className="flex justify-between mb-4 items-center">
                    <div className="flex items-center">
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
                  <div className="flex justify-between mb-4 items-center">
                    <div className="flex">
                      <Plus />
                      <span>Volume 24h:</span>
                    </div>
                    <span>
                      {currencySymbol}
                      {addCommas(coin.quote?.[currency].volume_24h) ||
                        addCommas(coin.quote.USD.volume_24h)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
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
                <div className="p-6 dark:bg-slate-800 rounded-lg w-full mt-8 bg-white">
                  <div className="flex justify-between mb-4 items-center">
                    <div className="flex items-center">
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
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Plus />
                      <span>Circulating Supply:</span>
                    </div>
                    <span>
                      {addCommas(coin.circulating_supply)} {coin.symbol}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex lg:text-base text-xs lg:flex-row flex-col">
                <div className="p-6 dark:bg-slate-800 rounded-lg w-full mt-8 mr-8 bg-white">
                  <div className="flex justify-between mb-4 items-center">
                    <div className="flex items-center">
                      <Plus />
                      <span>Market Cap:</span>
                    </div>
                    <span>
                      {currencySymbol}
                      {addCommas(coin.quote?.[currency].market_cap) ||
                        addCommas(coin.quote.USD.market_cap)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Plus />
                      <span>Fully Diluted Valuation:</span>
                    </div>
                    <span>
                      {currencySymbol}
                      {addCommas(
                        coin.quote?.[currency].fully_diluted_market_cap
                      ) || addCommas(coin.quote.USD.fully_diluted_market_cap)}
                    </span>
                  </div>
                </div>
                <div className="p-6 rounded-lg w-full mt-12"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
