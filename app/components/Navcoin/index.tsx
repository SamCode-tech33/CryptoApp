"use client";

import { useEffect, useState } from "react";
import { addCommas, Updownarrow, Defaulticon } from "../Utility";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Sevendaygraph } from "../Sevendaygraph";
import { prominent } from "color.js";
import queryString from "query-string";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { Filtericon } from "../svgComps";
import { Rangefilter } from "../rangeFilter";
import { Coinbar } from "../coinBarSlide";

export default function Navcoin() {
  const [colors, setColors] = useState<any>([]);
  const [filterState, setFilterState] = useState<any>("");
  const [filterValue, setFilterValue] = useState<any>("");
  const [query, setQuery] = useState<any>({});
  const [lowerValue, setLowerValue] = useState<any>("");
  const [upperValue, setUpperValue] = useState<any>("");
  const [dataMap, setDataMap] = useState<any>([]);
  const [colorLoad, setColorLoad] = useState<any>(false);
  const [start, setStart] = useState<number>(1);
  const [dataSet, setDataSet] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [error, setError] = useState<any>(false);

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

  const fetchImageColor = async (sym: string) => {
    try {
      setColorLoad(true);
      const color = await prominent(`/api/icons?sym=${sym}`);
      const extractedColor: string = `${(color[2] as any[])[0] * 2}, ${
        (color[2] as any[])[1] * 2
      }, ${(color[2] as any[])[2] * 2}`;
      setColors((prevColors: string[]) => [...prevColors, extractedColor]);

      setColorLoad(false);
      //eslint-disable-next-line
    } catch (error) {
      setColors((prevColors: string[]) => [...prevColors, "213 176 29"]);
      setColorLoad(false);
    }
  };

  const allImageFetch = async () => {
    dataSet.map((coin: any) => fetchImageColor(coin.symbol.toLowerCase()));
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
      allImageFetch();
      setDataMap(dataSet);
    }
  }, [dataSet]);

  useEffect(() => {
    retainQuery();
  }, [query, dataSet]);

  return (
    <div className="mt-12 relative">
      {loading && <div className="loading"></div>}
      {error ? (
        <p>The following {error} occured. Please try again later.</p>
      ) : (
        <ul className="mx-32">
          <li className="text-black dark:text-white h-12 flex items-center">
            <div className="w-8 flex justify-center mr-4">
              <span>#</span>
            </div>
            <div className="w-52 mr-1">
              <div
                className={
                  filterState === "Name"
                    ? "flex items-center p-2 rounded-sm hover:bg-slate-600 h-20"
                    : "flex items-center p-2 rounded-sm hover:bg-slate-800"
                }
                onMouseEnter={() => handleFilter("Name")}
                onMouseLeave={handleFilterExit}
              >
                <span>Name</span>
                <Filtericon />
                <form
                  className={
                    filterState === "Name" ? "flex ml-2 h-8" : "hidden"
                  }
                  action=""
                >
                  <input
                    type="text"
                    className="bg-slate-600 rounded-sm w-32 mr-1 dark:caret-white border-gray-300 border p-1"
                    value={filterValue}
                    onChange={handleFilterRender}
                    placeholder="Coin..."
                  />
                </form>
              </div>
            </div>
            <div className="w-32 flex mr-4 justify-left flex-col relative h-10">
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
              />
            </div>
            <div className="w-22 flex justify-left flex-col relative h-10">
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
              />
            </div>
            <div className="w-22 flex justify-left flex-col relative h-10">
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
              />
            </div>
            <div className="w-24 flex justify-left mr-2 flex-col relative h-10">
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
            <div className="w-72 flex justify-left">
              <span>24h Volume / Market Cap</span>
            </div>
            <div className="w-72 flex justify-left">
              <span>Circulating Coins / Total Supply</span>
            </div>
            <div className="w-36 flex justify-left mr-1">
              <span>Last 7d</span>
            </div>
            <button
              className="flex justify-left bg-slate-800 p-2.5 rounded-sm hover:bg-slate-600"
              onClick={handleFullClear}
            >
              Clear Filters
            </button>
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
                const volume24 = addCommas(coinQuote.volume_24h / 1e9);
                const marketCap = addCommas(coinQuote.market_cap / 1e9);
                const circSupply = addCommas(coin.circulating_supply / 1e6);
                const maxSupply = addCommas(coin.max_supply / 1e6);
                return (
                  <Link href={`coins/${coin.id}`} key={coin.name + coin.id}>
                    <li className="dark:bg-slate-800 text-black dark:text-white bg-slate-200 h-14 flex items-center rounded-md dark:hover:bg-slate-700 bg">
                      <div className="w-8 flex justify-center mr-4">
                        <span>{index + 1}</span>
                      </div>
                      <div className="w-52 flex justify-left mr-3 items-center">
                        <Defaulticon coin={coin.symbol} height="h-8" />
                        <span>
                          {coin.name} ({coin.symbol})
                        </span>
                      </div>
                      <div className="w-32 flex justify-left">
                        <span>
                          {currencySymbol} {coinPrice}
                        </span>
                      </div>
                      <div className="w-22 flex justify-left">
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
                      <div className="w-22 flex justify-left">
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
                      <div className="w-28 flex justify-left">
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
                      <Coinbar
                        currencySymbol={currencySymbol}
                        value1={volume24}
                        value2={marketCap}
                        colorLoad={colorLoad}
                        colors={colors}
                        index={index}
                        coinQuote={coinQuote}
                        first={true}
                      />
                      <Coinbar
                        currencySymbol={currencySymbol}
                        value1={circSupply}
                        value2={maxSupply}
                        colorLoad={colorLoad}
                        colors={colors}
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
