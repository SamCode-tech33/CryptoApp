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
import { Rangefilter } from "../rangeFilter";
import { Coinbar } from "../coinBarSlide";

export default function Navcoin() {
  const [filterState, setFilterState] = useState<any>("");
  const [filterValue, setFilterValue] = useState<any>("");
  const [query, setQuery] = useState<any>({});
  const [lowerValue, setLowerValue] = useState<any>("");
  const [upperValue, setUpperValue] = useState<any>("");
  const [dataMap, setDataMap] = useState<any>([]);
  const [start, setStart] = useState<number>(1);
  const [dataSet, setDataSet] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [error, setError] = useState<any>(false);
  const [percentSelected, setPercentSelected] = useState("1h%");
  const [percentOpen, setPercentOpen] = useState(false);

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

  const handleFilter = (filter: string) => {
    setFilterState(filter);
    setLowerValue("");
    setUpperValue("");
  };

  const handleFilterExit = () => {
    setFilterState("");
  };

  const handleFilterRender = (e: any) => {
    const newValue = e.target.value;
    setFilterValue(newValue);
    if (!filterState) return;
    if (!newValue) {
      delete query["Name"];
      const newSearch = queryString.stringify(query);
      window.history.replaceState({}, "", `${location.pathname}?${newSearch}`);
    } else if (location.search && !Object.hasOwn(query, filterState)) {
      window.history.replaceState(
        {},
        "",
        `${location.href}&${filterState}=${newValue}`
      );
    } else if (Object.hasOwn(query, filterState)) {
      const urlArray = Object.entries(query)[0];
      const foundValue = urlArray.find(
        (el) => urlArray.indexOf(el) === urlArray.indexOf(filterState) + 1
      ) as string;
      const urlRipper = location.search
        .split(foundValue)
        .toSpliced(1, 0, newValue)
        .join("");
      window.history.replaceState({}, "", `${urlRipper}`);
    } else {
      window.history.replaceState(
        {},
        "",
        `${location.pathname}?${filterState}=${newValue}`
      );
    }
    setDataMap(dataSet);
    setQuery(queryString.parse(location.search));
  };

  const handleLowerValue = (e: any) => {
    setLowerValue(e.target.value);
  };

  const handleUpperValue = (e: any) => {
    setUpperValue(e.target.value);
  };

  const handleRangeRender = (e: any) => {
    e.preventDefault();
    if (!filterState || !lowerValue || !upperValue) return;
    if (location.search && !Object.hasOwn(query, filterState)) {
      window.history.replaceState(
        {},
        "",
        `${location.href}&${filterState}=${lowerValue}_${upperValue}`
      );
    } else if (Object.hasOwn(query, filterState)) {
      const urlArray = Object.entries(query)[0];
      const foundValue = urlArray.find(
        (el) => urlArray.indexOf(el) === urlArray.indexOf(filterState) + 1
      ) as string;
      const urlRipper = location.search
        .split(foundValue)
        .toSpliced(1, 0, `${lowerValue}_${upperValue}`)
        .join("");
      window.history.replaceState({}, "", `${urlRipper}`);
    } else {
      window.history.replaceState(
        {},
        "",
        `${location.pathname}?${filterState}=${lowerValue}_${upperValue}`
      );
    }
    setDataMap(dataSet);
    setQuery(queryString.parse(location.search));
  };

  const handleFullClear = () => {
    if (location.search) {
      window.history.replaceState({}, "", `${location.pathname}`);
      setLowerValue("");
      setUpperValue("");
      setFilterState("");
      setFilterValue("");
      setQuery({});
      setDataMap(dataSet);
    } else {
      return;
    }
  };

  const handleRangeClear = (range: string) => {
    if (location.search) {
      delete query[range];
      setLowerValue("");
      setUpperValue("");
      const newSearch = queryString.stringify(query);
      window.history.replaceState({}, "", `${location.pathname}?${newSearch}`);
      setQuery(queryString.parse(location.search));
      setDataMap(dataSet);
      retainQuery();
    }
  };

  const retainQuery = () => {
    if (query.Name && dataMap.length) {
      setDataMap((prevDataMap: any) =>
        prevDataMap.filter((coin: any) =>
          coin.name.toLowerCase().includes(query.Name.toLowerCase())
        )
      );
    }
    if (query.Price && dataMap.length) {
      setDataMap((prevDataMap: any) =>
        prevDataMap.filter((coin: any) => {
          let coinQuote;
          if (coin.quote?.[currency]) {
            coinQuote = coin.quote?.[currency];
          } else {
            coinQuote = coin.quote.USD;
          }
          return (
            coinQuote.price > parseFloat(query.Price.split("_")[0]) &&
            coinQuote.price < parseFloat(query.Price.split("_")[1])
          );
        })
      );
    }
    if (query.Hour1 && dataMap.length) {
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
              parseFloat(query.Hour1.split("_")[0]) &&
            coinQuote.percent_change_1h < parseFloat(query.Hour1.split("_")[1])
          );
        })
      );
    }
    if (query.Hour24 && dataMap.length) {
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
              parseFloat(query.Hour24.split("_")[0]) &&
            coinQuote.percent_change_24h <
              parseFloat(query.Hour24.split("_")[1])
          );
        })
      );
    }
    if (query.Day7 && dataMap.length) {
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
              parseFloat(query.Day7.split("_")[0]) &&
            coinQuote.percent_change_7d < parseFloat(query.Day7.split("_")[1])
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
    <div className="mt-8 relative">
      {loading && <div className="loading"></div>}
      {error ? (
        <p>The following {error} occured. Please try again later.</p>
      ) : (
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
                <div className="w-name md:flex hidden">
                  <div
                    className={
                      filterState === "Name"
                        ? "flex items-center p-2 rounded-sm dark:hover:bg-slate-600 h-20 z-10 hover:bg-slate-300"
                        : "flex items-center p-2 rounded-sm dark:hover:bg-slate-800"
                    }
                    onMouseEnter={() => handleFilter("Name")}
                    onMouseLeave={handleFilterExit}
                  >
                    <span>Name</span>
                    <Filtericon />
                    <div
                      className={
                        filterState === "Name"
                          ? "flex items-center flex-col"
                          : "hidden"
                      }
                    >
                      <form className="flex ml-2 h-8 z-10" action="">
                        <input
                          type="text"
                          className="dark:bg-slate-600 rounded-sm w-32 mr-1 dark:caret-white border-gray-300 border p-1 mb-2"
                          value={filterValue}
                          onChange={handleFilterRender}
                          placeholder="Coin..."
                        />
                      </form>
                      <button
                        className="flex justify-left items-center dark:bg-slate-800 p-1 rounded-sm dark:hover:bg-slate-400 bg-violet-300 hover:bg-violet-400"
                        onClick={handleFullClear}
                      >
                        <span className="text-sm">Clear All</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-price relative h-10 md:flex hidden mr-1">
                  <Rangefilter
                    filterState={filterState}
                    currentFilterState="Price"
                    handleFilter={handleFilter}
                    handleFilterExit={handleFilterExit}
                    name="Price"
                    handleRangeRender={handleRangeRender}
                    handleLowerValue={handleLowerValue}
                    lowerValue={lowerValue}
                    handleUpperValue={handleUpperValue}
                    upperValue={upperValue}
                    handleRangeClear={handleRangeClear}
                    handleFullClear={handleFullClear}
                  />
                </div>
                <div className="w-1h relative h-10 md:flex hidden">
                  <Rangefilter
                    filterState={filterState}
                    currentFilterState="Hour1"
                    handleFilter={handleFilter}
                    handleFilterExit={handleFilterExit}
                    name="1h%"
                    handleRangeRender={handleRangeRender}
                    handleLowerValue={handleLowerValue}
                    lowerValue={lowerValue}
                    handleUpperValue={handleUpperValue}
                    upperValue={upperValue}
                    handleRangeClear={handleRangeClear}
                    handleFullClear={handleFullClear}
                  />
                </div>
                <div className="w-24h relative h-10 md:flex hidden">
                  <Rangefilter
                    filterState={filterState}
                    currentFilterState="Hour24"
                    handleFilter={handleFilter}
                    handleFilterExit={handleFilterExit}
                    name="24h%"
                    handleRangeRender={handleRangeRender}
                    handleLowerValue={handleLowerValue}
                    lowerValue={lowerValue}
                    handleUpperValue={handleUpperValue}
                    upperValue={upperValue}
                    handleRangeClear={handleRangeClear}
                    handleFullClear={handleFullClear}
                  />
                </div>
                <div className="w-7d relative h-10 md:flex hidden">
                  <Rangefilter
                    filterState={filterState}
                    currentFilterState="Day7"
                    handleFilter={handleFilter}
                    handleFilterExit={handleFilterExit}
                    name="7d%"
                    handleRangeRender={handleRangeRender}
                    handleLowerValue={handleLowerValue}
                    lowerValue={lowerValue}
                    handleUpperValue={handleUpperValue}
                    upperValue={upperValue}
                    handleRangeClear={handleRangeClear}
                  />
                </div>
              </div>
            </div>
            <div className="w-volume xl:flex hidden 2xl:text-base text-sm">
              <span>24h Volume / Market Cap</span>
            </div>
            <div className="w-volume xl:flex hidden 2xl:text-base text-sm">
              <span>Circulating Coins / Total Supply</span>
            </div>
            <div className="w-last7 flex">
              <span>Last 7d</span>
            </div>
          </li>
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
                      <div className="w-filter flex items-center">
                        <div className="w-name flex mx-3 items-center">
                          <Defaulticon coin={coin.symbol} height="h-8" margin="mr-2" />
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
                        <div className="w-1h justify-left md:flex hidden">
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
                        <div className="w-24h justify-left md:flex hidden">
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
                        <div className="w-7d justify-left md:flex hidden">
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
      )}
    </div>
  );
}
