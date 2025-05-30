import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { CustomTooltip, getGraphComparison, getGraphData } from "../Utility";

const Linegraph = ({
  coinHistory,
  limit,
  symbol,
  selectedTime,
  coinCompare,
  compare,
  today,
  currency,
  compareHidden,
  onConverter,
  rightSym,
  coinCompName,
  coinName,
}: any) => {

  if (coinHistory.length !== limit) {
    const timeInsufficientArray = coinHistory;
    for (let i = limit - coinHistory.length; i > 0; i--) {
      timeInsufficientArray.unshift({
        HIGH: 0,
        INSTRUMENT: `${symbol}-${currency}`,
        LOW: 0,
      });
    }
  }

  if (coinCompare.length !== limit) {
    const timeInsufficientArray = coinCompare;
    for (let i = limit - coinCompare.length; i > 0; i--) {
      timeInsufficientArray.unshift({
        HIGH: 0,
        INSTRUMENT: `${compare}-${currency}`,
        LOW: 0,
      });
    }
  }

  const pdata = getGraphData(coinHistory, selectedTime, 0, 0, 0, 0);
  const pdataComp = getGraphData(coinCompare, selectedTime, 0, 0, 0, 0);
  const pdataCombination = getGraphComparison(pdata, pdataComp);
  return (
    <div
      className="h-full w-full dark:bg-slate-800 rounded-md flex justify-end flex-col bg-white relative mb-4 xl:mr-2 xl:mb-0 px-1"
    >
      {" "}
      <div className="flex w-full justify-between h-full mt-1">
        {compare.length ? (
          <h1 className="ml-2 text-lg">
            <span className="text-violet-500">{coinName}</span> <span>/</span>{" "}
            <span className="value-comp-tool">{coinCompName}</span>
          </h1>
        ) : (
          <h1 className="ml-2 text-violet-500 text-lg">{coinName}</h1>
        )}
        <h1 className="ml-2 text-violet-500 text-lg mr-1.5">{today}</h1>
      </div>
      <ResponsiveContainer height="80%">
        <AreaChart
          data={pdataCombination}
          margin={{ left: 6, bottom: 8, right: 6 }}
        >
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
            domain={[
              `dataMin-${pdata.max - pdata.min * 2}`,
              `dataMax+${pdata.max - pdata.min}`,
            ]}
            hide={true}
            yAxisId="main"
          />
          <YAxis
            domain={[
              `dataMin-${pdataComp.max - pdataComp.min * 3}`,
              `dataMax+${pdataComp.max - pdataComp.min}`,
            ]}
            hide={true}
            yAxisId="compare"
          />
          <Tooltip
            offset={10}
            separator=""
            content={
              <CustomTooltip
                compHidden={compareHidden}
                onConverter={onConverter}
                rightSym={rightSym}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="rgb(139 92 246)"
            fillOpacity={1}
            fill="url(#color)"
            yAxisId="main"
          />
          {compare.length && (
            <Area
              type="monotone"
              dataKey="valueComp"
              stroke="#DA5BA5"
              fillOpacity={1}
              fill="url(#colorComp)"
              yAxisId="compare"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Linegraph;
