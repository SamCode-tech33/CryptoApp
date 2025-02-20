"use client";

import Navcoin from "../components/Navcoin";
import Slidercoin from "../components/Slidercoin";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";

export default function Coins() {
  const [coinHistory, setCoinHistory] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getCoinsHistory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/historical");
      setCoinHistory(data.Data);
      //eslint-disable-next-line
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  const today = new Date().toDateString();
  const pdata = coinHistory.map((day: any, i: number) => {
    const value = ((day.HIGH + day.LOW) / 2).toFixed(2);
    return {
      name: new Date(Date.now() + i * 300000 - 86400000)
        .toString()
        .split("G")[0],
      $: value,
    };
  });

  useEffect(() => {
    getCoinsHistory();
  }, []);

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
        {loading && <p>Loading. . .</p>}
        {error ? (
          <div className="h-80 w-half bg-slate-800 rounded-md flex justify-end flex-col">
            the following error has occured: {error}, please check again later.
          </div>
        ) : (
          <div className="h-80 w-half bg-slate-800 rounded-md flex justify-end flex-col">
            <h1 className="text-3xl ml-8 mb-2 text-violet-300">
              {coinHistory[0]?.INSTRUMENT}
            </h1>
            <h1 className="text-2xl ml-8 text-violet-300">{today}</h1>
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
                <YAxis domain={["dataMin-500", "dataMax+500"]} hide={true} />
                <Tooltip
                  offset={2}
                  separator=""
                  position={{ x: 225, y: -90 }}
                  itemStyle={{
                    color: "rgb(196 181 253)",
                    fontSize: 30,
                    marginLeft: 460,
                  }}
                  contentStyle={{ background: "none", border: "none" }}
                  labelStyle={{
                    color: "rgb(196 181 253)",
                    marginLeft: 362,
                    fontSize: 20,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="$"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#color)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="w-half h-80 bg-slate-800 rounded-md">Volume Graph</div>
      </div>
      <div className="flex ml-16 mt-8 justify-between bg-slate-800 px-3 py-1 rounded-md h-12 items-center w-1/4">
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
