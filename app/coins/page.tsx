"use client";

import Navcoin from "../components/Navcoin";
import Link from "next/link";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { setCompare } from "@/lib/symbolSlice";
import { changeTimePeriod } from "@/lib/timeSlice";
import { Comparegraph, Compexit } from "../components/svgComps";
import { Skeleton } from "../components/Skeleton";
const Linegraph = React.lazy(() => import("../components/Linegraph"));
const Bargraph = React.lazy(() => import("../components/Bargraph"));
const Slidercoin = React.lazy(() => import("../components/Slidercoin"));

export default function Coins() {
  const [coinHistory, setCoinHistory] = useState<any>([]);
  const [coinHistoryHour, setCoinHistoryHour] = useState<any>([]);
  const [coinCompare, setCoinCompare] = useState<any>([]);
  const [coinCompareHour, setCoinCompareHour] = useState<any>([]);
  const [selectedTime, setSelectedTime] = useState<string>("minutes 5 288");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const today = new Date().toDateString();

  const dispatch = useDispatch<AppDispatch>();

  const symbol = useSelector(
    (state: RootState) => state.symbol.sym
  ).toUpperCase();
  const compare = useSelector(
    (state: RootState) => state.symbol.compare
  ).toUpperCase();
  const isCompare = useSelector((state: RootState) => state.symbol.isCompare);

  const time = useSelector((state: RootState) => state.timePeriod.time);
  const aggre = useSelector((state: RootState) => state.timePeriod.aggre);
  const limit = useSelector((state: RootState) => state.timePeriod.limit);
  const currency = useSelector(
    (state: RootState) => state.currency.currencyType
  );

  const handleCompare = () => {
    dispatch(setCompare());
  };

  const getCoinsHistory = async (symbol: string) => {
    setLoading(true);
    try {
      if (symbol.length) {
        const { data } = await axios.get(
          `/api/historical?instrument=${symbol}-${currency}&timeperiod=${time}&aggre=${aggre}&limit=${limit}`
        );
        setCoinHistory(data.Data);
      }
      if (compare.length) {
        const { data } = await axios.get(
          `/api/historical?instrument=${compare}-${currency}&timeperiod=${time}&aggre=${aggre}&limit=${limit}`
        );
        setCoinCompare(data.Data);
      }
      if (symbol.length) {
        const { data } = await axios.get(
          `/api/historicalHour?instrument=${symbol}-${currency}`
        );
        setCoinHistoryHour(data.Data);
      }
      if (compare.length) {
        const { data } = await axios.get(
          `/api/historicalHour?instrument=${compare}-${currency}`
        );
        setCoinCompareHour(data.Data);
      }
      //eslint-disable-next-line
    } catch (error) {
      setError(true);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleTime = (e: any) => {
    const [time, aggre, limit] = e.target.id.split(" ");
    setSelectedTime(e.target.id);
    const newPeriod = {
      time: time,
      aggre: aggre,
      limit: limit,
    };
    dispatch(changeTimePeriod(newPeriod));
  };

  const isSelected = (id: string) => {
    let style = "";
    if (selectedTime === id) {
      style = "py-1 rounded-md px-3 dark:bg-violet-800 bg-violet-300";
    } else {
      style =
        "py-1 rounded-md px-3 dark:hover:bg-violet-800 hover:bg-violet-300";
    }
    return style;
  };

  useEffect(() => {
    getCoinsHistory(symbol);
  }, [symbol, selectedTime, compare, currency]);

  return (
    <div className="lg:px-16 md:px-12 px-2 bg-gray-200 dark:bg-slate-900 pt-4">
      <div className="flex flex-col items-end sm:justify-self-center md:w-full justify-between md:flex-row mx-2">
        <div className="md:h-28 sm:block hidden md:mb-0 mb-4">
          <div className="lg:mx-20 justify-center md:justify-start sm:mx-2 flex">
            <div className="p-3 rounded-sm dark:bg-slate-600 2xl:w-72 xl:w-64 sm:w-52 bg-violet-400 text-center">
              Coins
            </div>
            <Link href="/convertor">
              <button className="dark:bg-slate-800 p-3 rounded-sm dark:hover:bg-slate-600 2xl:w-72 xl:w-64 sm:w-52 bg-violet-300 hover:bg-violet-400">
                Convertor
              </button>
            </Link>
          </div>
        </div>
        <div className="lg:mx-20 justify-between flex items-center sm:justify-center md:justify-end w-full md:mr-3">
          <p className="sm:hidden block">Select a crypto to view statistics.</p>
          <button
            onClick={handleCompare}
            className="dark:bg-slate-800 p-3 rounded-md dark:hover:bg-slate-600 bg-violet-300 hover:bg-violet-400"
          >
            {isCompare ? (
              <div className="flex items-center">
                <Comparegraph />
                <span>Exit Comparison</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Compexit />
                <span>Compare</span>
              </div>
            )}
          </button>
        </div>
      </div>
      <Slidercoin />
      <div className="flex flex-col items-center justify-center xl:flex-row xl:justify-between lg:mx-20 mx-2">
        {error && (
          <div className="h-80 w-full dark:bg-slate-800 rounded-md flex justify-end flex-col bg-white relative mb-4 xl:mr-2 xl:mb-0">
            An error has occured, please check again later.
          </div>
        )}
        {loading ? (
          <Skeleton classTail="h-80 w-full dark:bg-slate-800 rounded-md flex justify-end flex-col bg-gray-300 relative mb-4 xl:mr-2 xl:mb-0" />
        ) : (
          <Linegraph
            coinHistory={coinHistory}
            limit={limit}
            symbol={symbol}
            selectedTime={selectedTime}
            coinCompare={coinCompare}
            compare={compare}
            today={today}
            currency={currency}
            coinName={symbol}
            coinCompName={compare}
          />
        )}
        {error && (
          <div className="h-80 w-full dark:bg-slate-800 rounded-md flex justify-end flex-col bg-white relative xl:ml-2 text-red">
            An error has occured, please check again later.
          </div>
        )}
        {loading ? (
          <Skeleton classTail="h-80 w-full dark:bg-slate-800 rounded-md flex justify-end flex-col bg-gray-300 relative xl:ml-2" />
        ) : (
          <Bargraph
            coinHistoryHour={coinHistoryHour}
            coinCompareHour={coinCompareHour}
            coinName={symbol}
            compare={compare}
            today={today}
          />
        )}
      </div>
      <div className="flex lg:mx-20 mt-4 justify-between dark:bg-slate-800 p-2 rounded-md h-12 items-center lg:w-80 xl:w-96 bg-white mx-2">
        <button
          onClick={handleTime}
          id="minutes 5 288"
          className={isSelected("minutes 5 288")}
        >
          1D
        </button>
        <button
          onClick={handleTime}
          id="hours 1 168"
          className={isSelected("hours 1 168")}
        >
          7D
        </button>
        <button
          onClick={handleTime}
          id="hours 1 336"
          className={isSelected("hours 1 336")}
        >
          14D
        </button>
        <button
          onClick={handleTime}
          id="hours 2 360"
          className={isSelected("hours 2 360")}
        >
          30D
        </button>
        <button
          onClick={handleTime}
          id="days 1 365"
          className={isSelected("days 1 365")}
        >
          1Y
        </button>
        <button
          onClick={handleTime}
          id="days 4 457"
          className={isSelected("days 4 457")}
        >
          5Y
        </button>
      </div>
      <Navcoin />
    </div>
  );
}
