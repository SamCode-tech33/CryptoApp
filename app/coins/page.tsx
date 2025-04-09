"use client";

import Navcoin from "../components/Navcoin";
import Slidercoin from "../components/Slidercoin";
import Link from "next/link";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { setCompare } from "@/lib/symbolSlice";
import { changeTimePeriod } from "@/lib/timeSlice";
import { Linegraph } from "../components/Linegraph";
import { Bargraph } from "../components/Bargraph";
import { Comparegraph, Compexit } from "../components/svgComps";

export default function Coins() {
  const [coinHistory, setCoinHistory] = useState<any>([]);
  const [coinHistoryHour, setCoinHistoryHour] = useState<any>([]);
  const [coinCompare, setCoinCompare] = useState<any>([]);
  const [coinCompareHour, setCoinCompareHour] = useState<any>([]);
  const [selectedTime, setSelectedTime] = useState<string>("minutes 5 288");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const [rendered, setRendered] = useState<boolean>(false);

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
    setRendered(false);
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
      getCoinsHistoryHour(symbol, compare);
      //eslint-disable-next-line
    } catch (error) {
      setError(true);
      setLoading(false);
    }
    setLoading(false);
  };

  const getCoinsHistoryHour = async (symbol: string, compare: string) => {
    setLoad(true);
    try {
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
      setErr(true);
      setLoad(false);
    }
    setLoad(false);
  };

  const apiLoaded = async () => {
    await getCoinsHistory(symbol);
    setRendered(true);
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
      style = "py-1 rounded-md px-5 bg-violet-800";
    } else {
      style = "py-1 rounded-md px-5";
    }
    return style;
  };

  useEffect(() => {
    getCoinsHistory(symbol);
    apiLoaded();
  }, [symbol, selectedTime, compare, currency]);

  return (
    <div className="mx-16">
      <div className="flex mx-18">
        <Link href="/coins">
          <button className="p-3 rounded-sm bg-slate-600 w-72">Coins</button>
        </Link>
        <Link href="/convertor">
          <button className="bg-slate-800 p-3 rounded-sm hover:bg-slate-600 w-72">
            Convertor
          </button>
        </Link>
      </div>
      <div className="flex justify-self-end mx-18">
        <button
          onClick={handleCompare}
          className="bg-slate-800 p-3 rounded-md hover:bg-slate-600"
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
      <Slidercoin />
      <div className="flex justify-between mx-18">
        {error ? (
          <div className="h-72 w-half bg-slate-800 rounded-md flex justify-end flex-col mr-4">
            An error has occured, please check again later.
          </div>
        ) : (
          <Linegraph
            coinHistory={coinHistory}
            limit={limit}
            rendered={rendered}
            symbol={symbol}
            selectedTime={selectedTime}
            coinCompare={coinCompare}
            compare={compare}
            loading={loading}
            today={today}
            currency={currency}
          />
        )}
        {err ? (
          <div className="h-72 w-half bg-slate-800 rounded-md flex justify-end flex-col ml-4">
            the following error has occured: {err}, please check again later.
          </div>
        ) : (
          <Bargraph
            coinHistoryHour={coinHistoryHour}
            coinCompareHour={coinCompareHour}
            load={load}
            coinCompare={coinCompare}
            coinHistory={coinHistory}
            compare={compare}
            today={today}
          />
        )}
      </div>
      <div className="flex ml-18 mt-4 justify-between bg-slate-800 px-3 py-1 rounded-md h-12 items-center w-1/4">
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
