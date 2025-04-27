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
import { useElementSize } from "../windowSizing";

const Bargraph = ({
  coinHistoryHour,
  coinCompareHour,
  load,
  coinCompare,
  coinHistory,
  compare,
}: any) => {
  const { ref, size } = useElementSize();
  const pdata = getVolumeGraphData(coinHistoryHour, 0);
  const pdataComp = getVolumeGraphData(coinCompareHour, 0);
  const pdataCombination = getVolumeGraphComparison(pdata, pdataComp);
  const currencySymbol = useSelector(
    (state: RootState) => state.currency.currencySymbol
  );

  return (
    <div
      ref={ref}
      className="h-80 w-full dark:bg-slate-800 rounded-md flex justify-end flex-col bg-white relative xl:ml-2"
    >
      {load && <div className="loading"></div>}
      <div className={compare.length ? "flex ml-4" : "flex mb-6 ml-4"}>
        <div>
          <div className="flex">
            <h1 className="text-lg ml-2 text-violet-500">
              {coinHistory[0]?.INSTRUMENT}
            </h1>
            <h1
              className={
                compare.length ? "text-lg ml-2 value-comp-tool" : "hidden"
              }
            >
              / {coinCompare[0]?.INSTRUMENT}
            </h1>
            <h1 className="text-lg ml-2 text-violet-500">Volume 24h</h1>
          </div>
          <div className="flex flex-col items-start justify-left ml-2">
            <h1 className="text-lg ml-1 text-violet-500">
              {currencySymbol} {addCommas(pdata.totalVolume)}
            </h1>
            <h1
              className={
                compare.length ? "text-lg ml-1 value-comp-tool" : "hidden"
              }
            >
              {currencySymbol} {addCommas(pdataComp.totalVolume)}
            </h1>
          </div>
        </div>
        <div></div>
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
            position={{ x: size.width - 227, y: -55 }}
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
