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
import { addCommas, CustomToolTipMini } from "../Utility";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useElementSize } from "../windowSizing";
import { Skeleton } from "../Skeleton";

export const Sevendaygraph = ({
  symbol,
  sevenDay,
}: {
  symbol: string;
  sevenDay: string;
}) => {
  const [coinHistory, setCoinHistory] = useState<any>([]);
  const [err, setErr] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);
  const { ref, size } = useElementSize();

  const currency = useSelector(
    (state: RootState) => state.currency.currencyType
  );

  const getCoinsHistory = async () => {
    setLoad(true);
    try {
      const { data } = await axios.get(
        `/api/historical?instrument=${symbol}-${currency}&timeperiod=hours&aggre=1&limit=168`
      );
      setCoinHistory(data.Data);
      //eslint-disable-next-line
    } catch (error) {
      setErr(true);
      setLoad(false);
    }
    setLoad(false);
  };

  let max = 0;
  let min = 0;
  const pdata = coinHistory.map((interval: any, i: number) => {
    if (i !== 0 && interval.HIGH > coinHistory[i - 1].HIGH) {
      max = interval.HIGH;
    }
    if (i !== 0 && interval.LOW < coinHistory[i - 1].LOW) {
      min = interval.LOW;
    }
    const value = (interval.HIGH + interval.LOW) / 2;
    const valueProper = addCommas(value);
    return {
      name: new Date(Date.now() + i * 3600000 - 604800000 + 3600000)
        .toString()
        .split("G")[0],
      value: value,
      valueProper: valueProper,
    };
  });

  useEffect(() => {
    getCoinsHistory();
  }, []);

  return (
    <div className="w-last7" ref={ref}>
      {err && <div className="text-red-800 m-auto">Insufficient Data</div>}
      {load ? (
        <Skeleton classTail="w-seven-graph h-12 rounded-sm flex md:ml-2 xl:ml-0 dark:bg-slate-600 bg-gray-300" />
      ) : (
        <div className="w-seven-graph h-12 rounded-sm flex md:ml-2 xl:ml-0">
          <ResponsiveContainer height="100%">
            <AreaChart data={pdata}>
              <defs>
                <linearGradient
                  id={`colorUv-${symbol}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="0.8"
                >
                  <stop offset="0%" stopColor={sevenDay} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={sevenDay} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide={true} />
              <YAxis
                domain={[`dataMin-${max - min}`, `dataMax+${max - min}`]}
                hide={true}
              />
              <Tooltip
                offset={10}
                separator=""
                content={<CustomToolTipMini />}
                position={{ x: size.width + 5, y: 5 }}
                active={true}
                cursor={false}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={sevenDay}
                fillOpacity={1}
                fill={`url(#colorUv-${symbol})`}
                name="$"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
