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
      const extractedColor = `${(color[2] as any[])[0] * 2}, ${
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-5 ml-1"
                >
                  <path d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                </svg>
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
              <div
                className={
                  filterState === "Price"
                    ? "p-4 rounded-sm hover:bg-slate-600 absolute h-52 z-10 flex items-center flex-col -left-10 -top-2"
                    : "p-2 rounded-sm hover:bg-slate-800"
                }
                onMouseEnter={() => handleFilter("Price")}
                onMouseLeave={handleFilterExit}
              >
                <div className="flex items-center mb-4">
                  <span>Price</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-5 ml-1"
                  >
                    <path d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                  </svg>
                </div>
                <form
                  className={
                    filterState === "Price"
                      ? "ml-2 h-8 flex flex-col items-center"
                      : "hidden"
                  }
                  action=""
                  onSubmit={handleRangeRender}
                >
                  <input
                    type="text"
                    className="bg-slate-600 rounded-sm w-28 mr-1 p-1 dark:caret-white border-gray-300 border"
                    onChange={handleLowerValue}
                    value={lowerValue}
                    placeholder="Lower Value"
                  />
                  <input
                    type="text"
                    className="bg-slate-600 rounded-sm w-28 mr-1 mt-4 p-1 dark:caret-white border-gray-300 border"
                    onChange={handleUpperValue}
                    value={upperValue}
                    placeholder="Upper Value"
                  />
                  <div className="flex">
                    <button
                      className="hover:bg-white bg-gray-800 p-1 rounded-sm mt-6 hover:text-black mr-4"
                      onClick={handleRangeRender}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      className="hover:bg-white bg-gray-800 p-1 rounded-sm mt-6 hover:text-black ml-4"
                      onClick={() => handleRangeClear("Price")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="w-22 flex justify-left flex-col relative h-10">
              <div
                className={
                  filterState === "Hour1"
                    ? "p-4 rounded-sm hover:bg-slate-600 absolute h-52 z-10 flex items-center flex-col -left-10 -top-2"
                    : "p-2 rounded-sm hover:bg-slate-800"
                }
                onMouseEnter={() => handleFilter("Hour1")}
                onMouseLeave={handleFilterExit}
              >
                <div className="flex items-center mb-4">
                  <span>1h%</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-5 ml-1"
                  >
                    <path d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                  </svg>
                </div>
                <form
                  className={
                    filterState === "Hour1"
                      ? "ml-2 h-8 flex flex-col items-center"
                      : "hidden"
                  }
                  action=""
                  onSubmit={handleRangeRender}
                >
                  <input
                    type="text"
                    className="bg-slate-600 rounded-sm w-28 mr-1 p-1 dark:caret-white border-gray-300 border"
                    onChange={handleLowerValue}
                    value={lowerValue}
                    placeholder="Lower Value"
                  />
                  <input
                    type="text"
                    className="bg-slate-600 rounded-sm w-28 mr-1 mt-4 p-1 dark:caret-white border-gray-300 border"
                    onChange={handleUpperValue}
                    value={upperValue}
                    placeholder="Upper Value"
                  />
                  <div className="flex">
                    <button
                      className="hover:bg-white bg-gray-800 p-1 rounded-sm mt-6 hover:text-black mr-4"
                      onClick={handleRangeRender}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      className="hover:bg-white bg-gray-800 p-1 rounded-sm mt-6 hover:text-black ml-4"
                      onClick={() => handleRangeClear("Hour1")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="w-22 flex justify-left flex-col relative h-10">
              <div
                className={
                  filterState === "Hour24"
                    ? "p-4 rounded-sm hover:bg-slate-600 absolute h-52 z-10 flex items-center flex-col -left-10 -top-2"
                    : "p-2 rounded-sm hover:bg-slate-800"
                }
                onMouseEnter={() => handleFilter("Hour24")}
                onMouseLeave={handleFilterExit}
              >
                <div className="flex items-center mb-4">
                  <span>24h%</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-5 ml-1"
                  >
                    <path d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                  </svg>
                </div>
                <form
                  className={
                    filterState === "Hour24"
                      ? "ml-2 h-8 flex flex-col items-center"
                      : "hidden"
                  }
                  action=""
                  onSubmit={handleRangeRender}
                >
                  <input
                    type="text"
                    className="bg-slate-600 rounded-sm w-28 mr-1 p-1 dark:caret-white border-gray-300 border"
                    onChange={handleLowerValue}
                    value={lowerValue}
                    placeholder="Lower Value"
                  />
                  <input
                    type="text"
                    className="bg-slate-600 rounded-sm w-28 mr-1 mt-4 p-1 dark:caret-white border-gray-300 border"
                    onChange={handleUpperValue}
                    value={upperValue}
                    placeholder="Upper Value"
                  />
                  <div className="flex">
                    <button
                      className="hover:bg-white bg-gray-800 p-1 rounded-sm mt-6 hover:text-black mr-4"
                      onClick={handleRangeRender}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      className="hover:bg-white bg-gray-800 p-1 rounded-sm mt-6 hover:text-black ml-4"
                      onClick={() => handleRangeClear("Hour24")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="w-24 flex justify-left mr-2 flex-col relative h-10">
              <div
                className={
                  filterState === "Day7"
                    ? "p-4 rounded-sm hover:bg-slate-600 absolute h-52 z-10 flex items-center flex-col -left-10 -top-2"
                    : "p-2 rounded-sm hover:bg-slate-800"
                }
                onMouseEnter={() => handleFilter("Day7")}
                onMouseLeave={handleFilterExit}
              >
                <div className="flex items-center mb-4">
                  <span>7d%</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-5 ml-1"
                  >
                    <path d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                  </svg>
                </div>
                <form
                  className={
                    filterState === "Day7"
                      ? "ml-2 h-8 flex flex-col items-center"
                      : "hidden"
                  }
                  action=""
                  onSubmit={handleRangeRender}
                >
                  <input
                    type="text"
                    className="bg-slate-600 rounded-sm w-28 mr-1 p-1 dark:caret-white border-gray-300 border"
                    onChange={handleLowerValue}
                    value={lowerValue}
                    placeholder="Lower Value"
                  />
                  <input
                    type="text"
                    className="bg-slate-600 rounded-sm w-28 mr-1 mt-4 p-1 dark:caret-white border-gray-300 border"
                    onChange={handleUpperValue}
                    value={upperValue}
                    placeholder="Upper Value"
                  />
                  <div className="flex">
                    <button
                      className="hover:bg-white bg-gray-800 p-1 rounded-sm mt-6 hover:text-black mr-4"
                      onClick={handleRangeRender}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      className="hover:bg-white bg-gray-800 p-1 rounded-sm mt-6 hover:text-black ml-4"
                      onClick={() => handleRangeClear("Day7")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
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
          <div
            id="scrollableDiv"
            style={{
              height: 800,
              overflow: "auto",
            }}
          >
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
                      <div className="w-72 flex justify-left flex-col">
                        <div className="flex w-64 justify-between">
                          <span>
                            {currencySymbol}
                            {volume24}B
                          </span>
                          <span>
                            {currencySymbol}
                            {marketCap}B
                          </span>
                        </div>{" "}
                        {colorLoad ? (
                          <div className="loading"></div>
                        ) : (
                          <div
                            className="w-64 h-2 rounded-lg"
                            style={{
                              backgroundColor: `rgba(${
                                colors[index + index]
                              }, 0.5)`,
                            }}
                          >
                            <div
                              className="h-2 rounded-lg"
                              style={{
                                width:
                                  coinQuote.volume_24h > coinQuote.market_cap
                                    ? "20rem"
                                    : `${
                                        (coinQuote.volume_24h /
                                          coinQuote.market_cap) *
                                        100
                                      }%`,
                                backgroundColor: `rgba(${
                                  colors[index + index]
                                }, 1)`,
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                      <div className="w-72 flex justify-left flex-col">
                        <div className="flex w-64 justify-between">
                          <span>{circSupply}M</span>
                          <span
                            className={
                              maxSupply === "0" ? "text-2xl" : maxSupply + ""
                            }
                          >
                            {maxSupply === "0" ? "∞" : maxSupply + "M"}
                          </span>
                        </div>
                        {colorLoad ? (
                          <div className="loading"></div>
                        ) : (
                          <div
                            className="w-64 h-2 rounded-lg"
                            style={{
                              backgroundColor: `rgba(${
                                colors[index + index]
                              }, 0.5)`,
                            }}
                          >
                            <div
                              className="h-2 rounded-lg"
                              style={{
                                width:
                                  maxSupply === "0"
                                    ? "0px"
                                    : `${
                                        (coin.circulating_supply /
                                          coin.max_supply) *
                                        100
                                      }%`,
                                backgroundColor: `rgba(${
                                  colors[index + index]
                                }, 1)`,
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
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
