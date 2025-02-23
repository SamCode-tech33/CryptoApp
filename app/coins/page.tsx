"use client";

import Navcoin from "../components/Navcoin";
import Slidercoin from "../components/Slidercoin";
import {
  addCommas,
  CustomTooltip,
  CustomizedLabel,
} from "../components/Utility";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  BarChart,
  Bar,
} from "recharts";

export default function Coins() {
  const [coinHistory, setCoinHistory] = useState<any>([]);
  const [coinHistoryHour, setCoinHistoryHour] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const symbol = useSelector((state: RootState) => state.symbol.sym);

  const getCoinsHistory = async (symbol: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/historical?instrument=${symbol}`);
      setCoinHistory(data.Data);
      getCoinsHistoryHour(symbol);
      //eslint-disable-next-line
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  const getCoinsHistoryHour = async (symbol: string) => {
    try {
      const { data } = await axios.get(
        `/api/historicalHour?instrument=${symbol}`
      );
      setCoinHistoryHour(data.Data);
      //eslint-disable-next-line
    } catch (error) {
      setError(true);
      setLoading(false);
    }
    setLoading(false);
  };

  const today = new Date().toDateString();
  const pdata = coinHistory.map((minute: any, i: number) => {
    const value = (minute.HIGH + minute.LOW) / 2;
    const valueProper = addCommas(value);
    return {
      name: new Date(Date.now() + i * 300000 - 86400000 + 300000)
        .toString()
        .split("G")[0],
      value: value,
      valueProper: valueProper,
    };
  });

  let totalVolume = 0;
  const pdata1 = coinHistoryHour.map((hour: any, i: number) => {
    const value = hour.QUOTE_VOLUME;
    totalVolume = totalVolume + value;
    const valueProper = addCommas(value);
    return {
      name: new Date(Date.now() + i * 3600000 - 86400000 + 3600000)
        .toString()
        .split("G")[0],
      value: value,
      valueProper: valueProper,
    };
  });

  useEffect(() => {
    getCoinsHistory(symbol);
  }, [symbol]);

  return (
    <div>
      <div className="flex">
        <Link href="/coins" className="ml-16">
          <Button className="mr-4">Coins</Button>
        </Link>
        <Link href="/convertor">
          <Button className="ml-4">Convertor</Button>
        </Link>
      </div>
      <div className="flex justify-self-end">
        <Button className="mt-8 mr-16">Compare</Button>
      </div>
      <Slidercoin />
      <div className="flex justify-between justify-left mt-8 mx-18">
        {error ? (
          <div className="h-80 w-half bg-slate-800 rounded-md flex justify-end flex-col">
            the following error has occured: {error}, please check again later.
          </div>
        ) : (
          <div className="h-80 w-half bg-slate-800 rounded-md flex justify-end flex-col">
            {loading && <p>Loading. . .</p>}
            <h1 className="text-3xl ml-8 mb-2 text-violet-500">
              {coinHistory[0]?.INSTRUMENT}
            </h1>
            <h1 className="text-2xl ml-8 text-violet-500">{today}</h1>
            <ResponsiveContainer height="70%">
              <AreaChart data={pdata}>
                <defs>
                  <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="rgb(139 92 246 / var(--tw-bg-opacity, 1))"
                      stopOpacity={0.9}
                    />
                    <stop
                      offset="100%"
                      stopColor="rgb(124 58 237 / var(--tw-bg-opacity, 1))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide={true} />
                <YAxis domain={["dataMin-5", "dataMax+5"]} hide={true} />
                <Tooltip
                  offset={10}
                  separator=""
                  content={<CustomTooltip />}
                  position={{ x: 555, y: -90 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#color)"
                  name="$"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        {error ? (
          <div className="h-80 w-half bg-slate-800 rounded-md flex justify-end flex-col">
            the following error has occured: {error}, please check again later.
          </div>
        ) : (
          <div className="h-80 w-half bg-slate-800 rounded-md flex justify-end flex-col">
            {loading && <p>Loading. . .</p>}
            <div className="flex">
              <h1 className="text-3xl ml-8 mb-1 text-violet-500">
                Volume 24h:
              </h1>
              <h1 className="text-3xl ml-8 mb-1 text-violet-500">
                ${addCommas(totalVolume)}
              </h1>
            </div>
            <h1 className="text-2xl ml-8 text-violet-500">{today}</h1>
            <ResponsiveContainer height="70%">
              <BarChart data={pdata1}>
                <XAxis dataKey="name" hide={true} />
                <YAxis hide={true} />
                <Tooltip
                  offset={10}
                  separator=""
                  content={<CustomTooltip />}
                  position={{ x: 555, y: -90 }}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="value"
                  fill="#007674"
                  activeBar={{ stroke: "white", strokeWidth: 3 }}
                  name="$"
                  label={<CustomizedLabel />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="flex ml-18 mt-8 justify-between bg-slate-800 px-3 py-1 rounded-md h-12 items-center w-1/4">
        <div className="bg-violet-800 py-1 rounded-md px-5">1D</div>
        <div className="py-1 rounded-md px-5">7D</div>
        <div className="py-1 rounded-md px-5">14D</div>
        <div className="py-1 rounded-md px-5">1M</div>
        <div className="py-1 rounded-md px-5">1W</div>
        <div className="py-1 rounded-md px-5">1Y</div>
        <div className="py-1 rounded-md px-5">5Y</div>
      </div>
      <Navcoin />
    </div>
  );
}
