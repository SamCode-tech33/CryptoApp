import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import {
  addCommas,
  CustomTooltip,
  CustomizedLabel,
  getVolumeGraphData,
  getVolumeGraphComparison,
} from "../Utility";

export const Bargraph = ({
  coinHistoryHour,
  coinCompareHour,
  load,
  coinCompare,
  coinHistory,
  compare,
  today,
}: any) => {
  const pdata = getVolumeGraphData(coinHistoryHour, 0);
  const pdataComp = getVolumeGraphData(coinCompareHour, 0);
  const pdataCombination = getVolumeGraphComparison(pdata, pdataComp);

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
            ${addCommas(pdata.totalVolume)}
            <span className="text-base">
              ({coinHistory[0]?.INSTRUMENT.split("-")[0]})
            </span>
          </h1>
          <h1
            className={
              compare.length ? "text-3xl ml-6 mb-1 value-comp-tool" : "hidden"
            }
          >
            ${addCommas(pdataComp.totalVolume)}
            <span className="text-base">
              ({coinCompare[0]?.INSTRUMENT.split("-")[0]})
            </span>
          </h1>
        </div>
      </div>
      <ResponsiveContainer height="70%">
        <BarChart
          data={pdataCombination}
          barCategoryGap="8%"
          barGap={0}
          stackOffset="sign"
        >
          <XAxis dataKey="index" />
          <YAxis hide={true} />
          <Tooltip
            offset={10}
            separator=""
            content={<CustomTooltip currency="USD" />}
            position={{ x: 575, y: -100 }}
            cursor={{ fill: "transparent" }}
          />
          {compare.length && (
            <Bar
              dataKey="valueComp"
              stackId="valueComp"
              fill="#DA5BA5"
              activeBar={{ stroke: "white", strokeWidth: 3 }}
              label={<CustomizedLabel />}
            />
          )}
          <Bar
            dataKey="value"
            stackId="valueComp"
            fill="#69388A"
            activeBar={{ stroke: "white", strokeWidth: 3 }}
            label={compare.length ? "" : <CustomizedLabel />}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
