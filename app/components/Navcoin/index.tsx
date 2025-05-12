"use client";

import { useEffect, useState } from "react";
import { addCommas, Updownarrow, Defaulticon } from "../Utility";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Sevendaygraph } from "../Sevendaygraph";
import queryString from "query-string";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { Filtericon, Uparrow } from "../svgComps";
import { Coinbar } from "../coinBarSlide";
import { Coinfilter } from "../Coinfilter";
import { Skeleton } from "../Skeleton";

export default function Navcoin() {
  const [query, setQuery] = useState<any>({});
  const [dataMap, setDataMap] = useState<any>([]);
  const [start, setStart] = useState<number>(1);
  const [dataSet, setDataSet] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [error, setError] = useState<any>(false);
  const [percentSelected, setPercentSelected] = useState("1h%");
  const [percentOpen, setPercentOpen] = useState(false);
  const [filterFocus, setFilterFocus] = useState(false);

  const currency = useSelector(
    (state: RootState) => state.currency.currencyType
  );
  const currencySymbol = useSelector(
    (state: RootState) => state.currency.currencySymbol
  );

  const getCoins = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/coins?start=${start}&convert=${currency}`
      );
      if (start === 1) {
        setDataSet(data.data);
      } else {
        setDataSet((prevDataSet: any) => [...prevDataSet, ...data.data]);
      }
      setLoading(false);
      //eslint-disable-next-line
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  const handleFilterRender = (locationString: string) => {
    window.history.replaceState(
      {},
      "",
      `${location.pathname}?${locationString}`
    );
    setDataMap(dataSet);
    setQuery(queryString.parse(location.search));
  };

  const handleFullClear = () => {
    if (location.search) {
      window.history.replaceState({}, "", `${location.pathname}`);
      setQuery({});
      setDataMap(dataSet);
    } else {
      return;
    }
  };

  const retainQuery = () => {
    if (query.q && dataMap.length) {
      setDataMap((prevDataMap: any) =>
        prevDataMap.filter((coin: any) =>
          coin.name.toLowerCase().includes(query.q.toLowerCase())
        )
      );
    }
    if (query.price && dataMap.length) {
      setDataMap((prevDataMap: any) =>
        prevDataMap.filter((coin: any) => {
          let coinQuote;
          if (coin.quote?.[currency]) {
            coinQuote = coin.quote?.[currency];
          } else {
            coinQuote = coin.quote.USD;
          }
          return (
            coinQuote.price > parseFloat(query.price.split("_")[0]) &&
            coinQuote.price < parseFloat(query.price.split("_")[1])
          );
        })
      );
    }
    if (query.hour1 && dataMap.length) {
      setDataMap((prevDataMap: any) =>
        prevDataMap.filter((coin: any) => {
          let coinQuote;
          if (coin.quote?.[currency]) {
            coinQuote = coin.quote?.[currency];
          } else {
            coinQuote = coin.quote.USD;
          }
          return (
            coinQuote.percent_change_1h >
              parseFloat(query.hour1.split("_")[0]) &&
            coinQuote.percent_change_1h < parseFloat(query.hour1.split("_")[1])
          );
        })
      );
    }
    if (query.hour24 && dataMap.length) {
      setDataMap((prevDataMap: any) =>
        prevDataMap.filter((coin: any) => {
          let coinQuote;
          if (coin.quote?.[currency]) {
            coinQuote = coin.quote?.[currency];
          } else {
            coinQuote = coin.quote.USD;
          }
          return (
            coinQuote.percent_change_24h >
              parseFloat(query.hour24.split("_")[0]) &&
            coinQuote.percent_change_24h <
              parseFloat(query.hour24.split("_")[1])
          );
        })
      );
    }
    if (query.day7 && dataMap.length) {
      setDataMap((prevDataMap: any) =>
        prevDataMap.filter((coin: any) => {
          let coinQuote;
          if (coin.quote?.[currency]) {
            coinQuote = coin.quote?.[currency];
          } else {
            coinQuote = coin.quote.USD;
          }
          return (
            coinQuote.percent_change_7d >
              parseFloat(query.day7.split("_")[0]) &&
            coinQuote.percent_change_7d < parseFloat(query.day7.split("_")[1])
          );
        })
      );
    }
  };

  const fetchNext = () => {
    setStart((prevStart) => prevStart + 100);
  };

  const handlePercentSelect = (e: any) => {
    setPercentOpen(false);
    setPercentSelected(e.target.innerText);
  };

  useEffect(() => {
    getCoins();
    setQuery(queryString.parse(location.search));
  }, [start]);

  useEffect(() => {
    setQuery(queryString.parse(location.search));
  }, [filterFocus]);

  useEffect(() => {
    setStart(1);
    setDataSet([]);
    getCoins();
  }, [currency]);

  useEffect(() => {
    if (!loading) {
      setDataMap(dataSet);
    }
  }, [dataSet]);

  useEffect(() => {
    retainQuery();
  }, [query, dataSet]);

  return (
    <div>
      {filterFocus && (
        <div className="dark:bg-slate-800 border border-gray-600 fixed filter-focus z-10 flex items-center justify-center top-1/2 left-1/2 sm:p-8 py-8 bg-slate-300">
          <Coinfilter
            handleFilterRender={handleFilterRender}
            handleFullClear={handleFullClear}
            closeFocus={() => setFilterFocus(false)}
          />
        </div>
      )}
      <div className="mt-8 relative">
        {error && <p>The following {error} occured. Please try again later.</p>}
        <ul className="lg:mx-20 mx-2">
          <li className="text-black dark:text-white h-12 flex items-center">
            <div className="justify-center mr-4 w-number md:flex hidden">
              <span>#</span>
            </div>
            <div className="w-filter">
              <div className="items-center w-full flex">
                <h1 className="md:hidden block ml-4 w-5/12 mr-1.5 sm:mr-10 md:mr-0">
                  Market overview
                </h1>
                <div
                  className="relative ml-6 md:hidden flex items-center dark:bg-slate-600 rounded-md border p-1 cursor-pointer dark:hover:bg-slate-400"
                  onClick={() => setPercentOpen(!percentOpen)}
                >
                  <span className="">{percentSelected}</span>
                  <Uparrow isOpen={percentOpen} />
                  {percentOpen && (
                    <div className="absolute dark:bg-slate-950 rounded-md border top-full -left-0.5">
                      <div
                        className="dark:hover:bg-slate-600 p-3 cursor-pointer rounded-md"
                        onClick={handlePercentSelect}
                      >
                        1h%
                      </div>
                      <div
                        className="dark:hover:bg-slate-600 p-3 cursor-pointer rounded-md"
                        onClick={handlePercentSelect}
                      >
                        24h%
                      </div>
                      <div
                        className="dark:hover:bg-slate-600 p-3 cursor-pointer rounded-md"
                        onClick={handlePercentSelect}
                      >
                        7d%
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-name md:flex hidden mr-1.5">Name</div>
                <div className="w-price relative md:flex hidden mr-4">
                  Price
                </div>
                <div className="w-1h relative md:flex hidden">1h%</div>
                <div className="w-24h relative md:flex hidden">24h%</div>
                <div className="w-7d relative md:flex hidden">7d%</div>
              </div>
            </div>
            <div className="w-volume xl:flex hidden 2xl:text-base text-sm mr-3">
              <span>24h Volume / Market Cap</span>
            </div>
            <div className="w-volume xl:flex hidden 2xl:text-base text-sm">
              <span>Circulating Coins / Total Supply</span>
            </div>
            <div className="w-last7 flex">
              <span>Last 7d</span>
            </div>
            <button
              className="flex items-center dark:bg-slate-800 sm:p-2 p-1 rounded-md dark:hover:bg-slate-600 border border-gray-600"
              onClick={() => setFilterFocus(!filterFocus)}
            >
              <span className="sm:block hidden mr-1">Filter</span>
              <Filtericon />
            </button>
          </li>
          {loading && (
            <div>
              {[...Array(100)].map((_, i) => (
                <Skeleton
                  key={i}
                  classTail="dark:bg-slate-800 text-black dark:text-white bg-gray-300 h-14 flex items-center rounded-md mb-4"
                  style={{ animationDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
          )}
          <div id="scrollableDiv" className="h-150 overflow-auto">
            <InfiniteScroll
              dataLength={dataMap.length}
              next={fetchNext}
              hasMore={true}
              loader={<div className="loading"></div>}
              scrollableTarget="scrollableDiv"
              scrollThreshold={0.9}
            >
              {dataMap.map((coin: any, index: number) => {
                if (!coin.quote?.[currency]) {
                  return null;
                }
                let coinQuote;
                if (coin.quote?.[currency]) {
                  coinQuote = coin.quote?.[currency];
                } else {
                  coinQuote = coin.quote.USD;
                }
                const coinPrice = addCommas(coinQuote.price);
                return (
                  <Link href={`coins/${coin.id}`} key={coin.name + coin.id}>
                    <li className="dark:bg-slate-800 text-black dark:text-white bg-white h-14 flex items-center rounded-md dark:hover:bg-slate-700 hover:bg-violet-200">
                      <div className="w-number md:flex justify-center hidden">
                        <span>{index + 1}</span>
                      </div>
                      <div className="w-filter flex items-center mr-3">
                        <div className="w-name flex mx-3 items-center">
                          <Defaulticon
                            coin={coin.symbol}
                            height="h-8"
                            margin="mr-2"
                          />
                          <span className="hidden sm:block">
                            {coin.name} ({coin.symbol})
                          </span>
                          <div className="w-full flex flex-col sm:hidden">
                            <span>{coin.symbol}</span>
                            <span className="text-sm opacity-30">
                              {coin.name.split(" ")[0]}
                            </span>
                          </div>
                        </div>
                        <div className="w-price text-sm sm:text-base flex flex-col 2xl:mr-4 xl:mr-7 md:mr-7 price-pad">
                          <div className="w-full text-start">
                            {currencySymbol}
                            {coinPrice}
                          </div>
                          {percentSelected === "1h%" && (
                            <div className="md:hidden flex w-full items-center text-xs">
                              <Updownarrow coin={coinQuote.percent_change_1h} />
                              <span
                                className={
                                  coinQuote.percent_change_1h > 0
                                    ? "text-green-500"
                                    : "text-red-600"
                                }
                              >
                                {Math.abs(
                                  coinQuote.percent_change_1h.toFixed(2)
                                )}
                                %
                              </span>
                            </div>
                          )}
                          {percentSelected === "24h%" && (
                            <div className="ml-2 md:hidden flex w-20">
                              <Updownarrow
                                coin={coinQuote.percent_change_24h}
                              />
                              <span
                                className={
                                  coinQuote.percent_change_24h > 0
                                    ? "text-green-500"
                                    : "text-red-600"
                                }
                              >
                                {Math.abs(
                                  coinQuote.percent_change_24h.toFixed(2)
                                )}
                                %
                              </span>
                            </div>
                          )}
                          {percentSelected === "7d%" && (
                            <div className="ml-2 md:hidden flex w-20">
                              <Updownarrow coin={coinQuote.percent_change_7d} />
                              <span
                                className={
                                  coinQuote.percent_change_7d > 0
                                    ? "text-green-500"
                                    : "text-red-600"
                                }
                              >
                                {Math.abs(
                                  coinQuote.percent_change_7d.toFixed(2)
                                )}
                                %
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="w-1h justify-left md:flex hidden items-center">
                          <Updownarrow coin={coinQuote.percent_change_1h} />
                          <span
                            className={
                              coinQuote.percent_change_1h > 0
                                ? "text-green-500"
                                : "text-red-600"
                            }
                          >
                            {Math.abs(coinQuote.percent_change_1h.toFixed(2))}%
                          </span>
                        </div>
                        <div className="w-24h justify-left md:flex hidden items-center">
                          <Updownarrow coin={coinQuote.percent_change_24h} />
                          <span
                            className={
                              coinQuote.percent_change_24h > 0
                                ? "text-green-500"
                                : "text-red-600"
                            }
                          >
                            {Math.abs(coinQuote.percent_change_24h.toFixed(2))}%
                          </span>
                        </div>
                        <div className="w-7d justify-left md:flex hidden items-center">
                          <Updownarrow coin={coinQuote.percent_change_7d} />
                          <span
                            className={
                              coinQuote.percent_change_7d > 0
                                ? "text-green-500"
                                : "text-red-600"
                            }
                          >
                            {Math.abs(coinQuote.percent_change_7d.toFixed(2))}%
                          </span>
                        </div>
                      </div>
                      <Coinbar
                        currencySymbol={currencySymbol}
                        value1={coinQuote.volume_24h / 1e9}
                        value2={coinQuote.market_cap / 1e9}
                        index={index}
                        coinQuote={coinQuote}
                        first={true}
                      />
                      <Coinbar
                        currencySymbol={currencySymbol}
                        value1={coin.circulating_supply / 1e6}
                        value2={coin.max_supply / 1e6}
                        index={index}
                        coinQuote={coinQuote}
                        first={false}
                      />
                      {dataSet.length > 0 && coin.symbol === "BTC" && (
                        <Sevendaygraph
                          symbol={coin.symbol.toUpperCase()}
                          sevenDay={
                            coinQuote.percent_change_7d < 0
                              ? "rgb(220 38 38)"
                              : "rgb(34 197 94)"
                          }
                        />
                      )}
                    </li>
                  </Link>
                );
              })}
            </InfiniteScroll>
          </div>
        </ul>
      </div>
    </div>
  );
}
