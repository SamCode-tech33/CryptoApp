import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { addCommas, CustomTooltip } from "../Utility";

export const Linegraph = ({
  coinHistory,
  limit,
  rendered,
  symbol,
  selectedTime,
  coinCompare,
  compare,
  loading,
  today,
}: any) => {
  if (coinHistory.length !== limit && rendered) {
    const timeInsufficientArray = coinHistory;
    for (let i = limit - coinHistory.length; i > 0; i--) {
      timeInsufficientArray.unshift({
        HIGH: 0,
        INSTRUMENT: `${symbol}-USD`,
        LOW: 0,
      });
    }
  }

  if (coinCompare.length !== limit && rendered) {
    const timeInsufficientArray = coinCompare;
    for (let i = limit - coinCompare.length; i > 0; i--) {
      timeInsufficientArray.unshift({
        HIGH: 0,
        INSTRUMENT: `${compare}-USD`,
        LOW: 0,
      });
    }
  }

  let graphTime = 0;
  let graphPeriod = 0;
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
    if (selectedTime === "minutes 5 288") {
      graphTime = 300000;
      graphPeriod = 86400000;
    } else if (selectedTime === "hours 1 168") {
      graphTime = 3600000;
      graphPeriod = 604800000;
    } else if (selectedTime === "hours 1 336") {
      graphTime = 3600000;
      graphPeriod = 1209600000;
    } else if (selectedTime === "hours 2 360") {
      graphTime = 7200000;
      graphPeriod = 2592000000;
    } else if (selectedTime === "days 1 365") {
      graphTime = 86400000;
      graphPeriod = 31579200000;
    } else if (selectedTime === "days 4 457") {
      graphTime = 345600000;
      graphPeriod = 157939200000;
    }
    return {
      coin: interval.INSTRUMENT,
      name: new Date(Date.now() + i * graphTime - graphPeriod + graphTime)
        .toString()
        .split("G")[0],
      value: value,
      valueProper: valueProper,
    };
  });

  let graphTimeCompare = 0;
  let graphPeriodCompare = 0;
  let maxCompare = 0;
  let minCompare = 0;
  const pdataCompare = coinCompare.map((interval: any, i: number) => {
    if (i !== 0 && interval.HIGH > coinCompare[i - 1].HIGH) {
      maxCompare = interval.HIGH;
    }
    if (i !== 0 && interval.LOW < coinCompare[i - 1].LOW) {
      minCompare = interval.LOW;
    }
    const value = (interval.HIGH + interval.LOW) / 2;
    const valueProper = addCommas(value);
    if (selectedTime === "minutes 5 288") {
      graphTimeCompare = 300000;
      graphPeriodCompare = 86400000;
    } else if (selectedTime === "hours 1 168") {
      graphTimeCompare = 3600000;
      graphPeriodCompare = 604800000;
    } else if (selectedTime === "hours 1 336") {
      graphTimeCompare = 3600000;
      graphPeriodCompare = 1209600000;
    } else if (selectedTime === "hours 2 360") {
      graphTimeCompare = 7200000;
      graphPeriodCompare = 2592000000;
    } else if (selectedTime === "days 1 365") {
      graphTimeCompare = 86400000;
      graphPeriodCompare = 31579200000;
    } else if (selectedTime === "days 4 457") {
      graphTimeCompare = 345600000;
      graphPeriodCompare = 157939200000;
    }
    return {
      coin: interval.INSTRUMENT,
      name: new Date(
        Date.now() +
          i * graphTimeCompare -
          graphPeriodCompare +
          graphTimeCompare
      )
        .toString()
        .split("G")[0],
      value: value,
      valueProper: valueProper,
    };
  });

  const combi = pdata.map((data: any, index: number) => {
    if (coinCompare.length && rendered) {
      let valueComp = 0;
      let valueCompProper = 0;
      if (pdataCompare[index]) {
        valueComp = pdataCompare[index].value;
        valueCompProper = pdataCompare[index].valueProper;
      } else {
        valueComp = 0;
        valueCompProper = 0;
      }
      return {
        ...data,
        valueComp: valueComp,
        valueCompProper: valueCompProper,
      };
    } else {
      return data;
    }
  });
  return (
    <div className="h-82 w-half bg-slate-800 rounded-md flex justify-end flex-col">
      {loading && <p>Loading. . .</p>}
      {compare.length ? (
        <h1 className="text-3xl ml-8 mb-2">
          <span className="text-violet-500">{coinHistory[0]?.INSTRUMENT}</span>{" "}
          <span>/</span>{" "}
          <span className="value-comp-tool">{coinCompare[0]?.INSTRUMENT}</span>
        </h1>
      ) : (
        <h1 className="text-3xl ml-8 mb-2 text-violet-500">
          {coinHistory[0]?.INSTRUMENT}
        </h1>
      )}
      <h1 className="text-2xl ml-8 mb-4 text-violet-500">{today}</h1>
      <ResponsiveContainer height="70%">
        <AreaChart data={combi}>
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="0.8">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="0.8">
              <stop offset="0%" stopColor="#DA5BA5" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#DA5BA5" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" hide={true} />
          <YAxis
            domain={[`dataMin-${max - min * 2}`, `dataMax+${max - min}`]}
            hide={true}
            yAxisId="main"
          />
          <YAxis
            domain={[
              `dataMin-${maxCompare - minCompare * 3}`,
              `dataMax+${maxCompare - minCompare}`,
            ]}
            hide={true}
            yAxisId="compare"
          />
          <Tooltip
            offset={10}
            separator=""
            content={<CustomTooltip />}
            position={{ x: 555, y: -110 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="rgb(139 92 246)"
            fillOpacity={1}
            fill="url(#color)"
            name="$"
            yAxisId="main"
          />
          {compare.length && (
            <Area
              type="monotone"
              dataKey="valueComp"
              stroke="#DA5BA5"
              fillOpacity={1}
              fill="url(#colorComp)"
              name="$"
              yAxisId="compare"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
