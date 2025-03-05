import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { addCommas, CustomTooltip, CustomizedLabel } from "../Utility";

export const Bargraph = ({
  coinHistoryHour,
  coinCompareHour,
  load,
  coinCompare,
  coinHistory,
  compare,
  today,
}: any) => {
  let totalVolume = 0;
  const pdata1 = coinHistoryHour.map((hour: any, i: number) => {
    const value = hour.QUOTE_VOLUME;
    totalVolume = totalVolume + value;
    const valueProper = addCommas(value);
    return {
      coin: hour.INSTRUMENT,
      name: new Date(Date.now() + i * 3600000 - 86400000 + 3600000)
        .toString()
        .split("G")[0],
      value: value,
      valueProper: valueProper,
    };
  });

  let totalVolumeCompare = 0;
  const pdata1Compare = coinCompareHour.map((hour: any, i: number) => {
    const value = hour.QUOTE_VOLUME;
    totalVolumeCompare = totalVolumeCompare + value;
    const valueProper = addCommas(value);
    return {
      coin: hour.INSTRUMENT,
      name: new Date(Date.now() + i * 3600000 - 86400000 + 3600000)
        .toString()
        .split("G")[0],
      value: value,
      valueProper: valueProper,
      index: i + 1,
    };
  });

  const combi1 = pdata1.map((data: any, index: number) => {
    if (pdata1Compare.length) {
      return {
        ...data,
        valueComp: pdata1Compare[index].value,
        valueCompProper: pdata1Compare[index].valueProper,
      };
    } else {
      return data;
    }
  });
  return (
    <div className="h-82 w-half bg-slate-800 rounded-md flex justify-end flex-col">
      {load && <p>Loading. . .</p>}
      <div className="flex">
        <div>
          <h1 className="text-3xl ml-6 mb-1 text-violet-500">Volume 24h:</h1>
          <h1 className="text-2xl ml-6 mb-4 text-violet-500">{today}</h1>
        </div>
        <div>
          <h1 className="text-3xl ml-6 mb-1 text-violet-500">
            ${addCommas(totalVolume)}
            <span className="text-base">
              ({coinHistory[0]?.INSTRUMENT.split("-")[0]})
            </span>
          </h1>
          <h1
            className={
              compare.length ? "text-3xl ml-6 mb-1 value-comp-tool" : "hidden"
            }
          >
            ${addCommas(totalVolumeCompare)}
            <span className="text-base">
              ({coinCompare[0]?.INSTRUMENT.split("-")[0]})
            </span>
          </h1>
        </div>
      </div>
      <ResponsiveContainer height="70%">
        <BarChart
          data={combi1}
          barCategoryGap="8%"
          barGap={0}
          stackOffset="sign"
        >
          <XAxis dataKey="index" />
          <YAxis hide={true} />
          <Tooltip
            offset={10}
            separator=""
            content={<CustomTooltip />}
            position={{ x: 575, y: -100 }}
            cursor={{ fill: "transparent" }}
          />
          {compare.length && (
            <Bar
              dataKey="valueComp"
              stackId="valueComp"
              fill="#DA5BA5"
              activeBar={{ stroke: "white", strokeWidth: 3 }}
              name="$"
              label={<CustomizedLabel />}
            />
          )}
          <Bar
            dataKey="value"
            stackId="valueComp"
            fill="#69388A"
            activeBar={{ stroke: "white", strokeWidth: 3 }}
            name="$"
            label={compare.length ? "" : <CustomizedLabel />}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
