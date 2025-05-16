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
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const Bargraph = ({
  coinHistoryHour,
  coinCompareHour,
  coinName,
  compare,
  coinCompName,
}: any) => {
  const pdata = getVolumeGraphData(coinHistoryHour, 0);
  const pdataComp = getVolumeGraphData(coinCompareHour, 0);
  const pdataCombination = getVolumeGraphComparison(pdata, pdataComp);
  const currencySymbol = useSelector(
    (state: RootState) => state.currency.currencySymbol
  );

  return (
    <div className="h-full w-full dark:bg-slate-800 rounded-md flex flex-col justify-center bg-white relative xl:ml-2 px-1">
      <div className="flex w-full">
        <div className="flex justify-between w-full">
          <div className="flex">
            <h1 className="text-lg ml-2 text-violet-500">{coinName}</h1>
            <h1
              className={
                compare.length ? "text-lg ml-1 value-comp-tool" : "hidden"
              }
            >
              / {coinCompName}
            </h1>
          </div>
          <div
            className={
              compare.length
                ? "flex items-start justify-left mr-2"
                : "flex flex-col items-start justify-left mr-2"
            }
          >
            <h1
              className={
                compare.length
                  ? "text-lg text-violet-500 mr-2"
                  : "text-lg text-violet-500"
              }
            >
              Vol-24h:
            </h1>
            <div>
              <h1 className="text-lg text-violet-500">
                {currencySymbol}
                {addCommas(pdata.totalVolume)}
              </h1>
              <h1
                className={
                  compare.length ? "text-lg value-comp-tool" : "hidden"
                }
              >
                {currencySymbol}
                {addCommas(pdataComp.totalVolume)}
              </h1>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <ResponsiveContainer height="80%">
        <BarChart
          data={pdataCombination}
          barCategoryGap="8%"
          barGap={0}
          stackOffset="sign"
          margin={{ left: 4, bottom: 4, right: 4 }}
        >
          <XAxis hide={true} />
          <YAxis hide={true} />
          <Tooltip
            offset={10}
            separator=""
            content={<CustomTooltip currency="USD" />}
            cursor={{ fill: "transparent" }}
          />
          {compare.length && (
            <Bar
              dataKey="valueComp"
              stackId="valueComp"
              fill="#DA5BA5"
              activeBar={{ stroke: "teal", strokeWidth: 3 }}
              label={<CustomizedLabel />}
            />
          )}
          <Bar
            dataKey="value"
            stackId="valueComp"
            fill="#69388A"
            activeBar={{ stroke: "teal", strokeWidth: 3 }}
            label={compare.length ? "" : <CustomizedLabel />}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Bargraph;
