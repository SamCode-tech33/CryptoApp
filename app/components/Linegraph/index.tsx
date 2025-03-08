import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { CustomTooltip, getGraphComparison, getGraphData } from "../Utility";

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
  currency,
  selectedPriceRight,
}: any) => {
  if (coinHistory.length !== limit && rendered) {
    const timeInsufficientArray = coinHistory;
    for (let i = limit - coinHistory.length; i > 0; i--) {
      timeInsufficientArray.unshift({
        HIGH: 0,
        INSTRUMENT: `${symbol}-${currency}`,
        LOW: 0,
      });
    }
  }

  if (coinCompare.length !== limit && rendered) {
    const timeInsufficientArray = coinCompare;
    for (let i = limit - coinCompare.length; i > 0; i--) {
      timeInsufficientArray.unshift({
        HIGH: 0,
        INSTRUMENT: `${compare}-${currency}`,
        LOW: 0,
      });
    }
  }

  const pdata = getGraphData(
    coinHistory,
    selectedPriceRight,
    currency,
    selectedTime,
    0,
    0,
    0,
    0
  );
  const pdataComp = getGraphData(
    coinCompare,
    selectedPriceRight,
    currency,
    selectedTime,
    0,
    0,
    0,
    0
  );
  const pdataCombination = getGraphComparison(pdata, pdataComp, rendered);
  return (
    <div>
      {loading && <p>Loading. . .</p>}
      {compare.length ? (
        <h1 className="text-3xl ml-8 mb-2">
          <span className="text-violet-500">{coinHistory[0]?.INSTRUMENT}</span>{" "}
          <span>/</span>{" "}
          <span className="value-comp-tool">{coinCompare[0]?.INSTRUMENT}</span>
        </h1>
      ) : (
        <h1 className="text-3xl ml-8 mb-2 text-violet-500">
          {coinHistory[0]?.INSTRUMENT.split("-")[0]}-{currency}
        </h1>
      )}
      <h1 className="text-2xl ml-8 mb-4 text-violet-500">{today}</h1>
      <ResponsiveContainer height="70%">
        <AreaChart data={pdataCombination}>
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
            content={<CustomTooltip currency={currency} />}
            position={{ x: currency === "USD" ? 555 : 1450, y: -110 }}
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
