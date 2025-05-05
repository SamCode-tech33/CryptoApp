import { addCommas } from "../Utility";

export const Coinbar = ({ currencySymbol, value1, value2, first }: any) => {
  return (
    <div className="w-volume xl:flex justify-left flex-col hidden ml-3 2xl:text-sm text-xs">
      {first === true ? (
        <div className="flex bar-width justify-between">
          <span>
            {currencySymbol}
            {addCommas(value1)}B
          </span>
          <span>
            {currencySymbol}
            {addCommas(value2)}B
          </span>
        </div>
      ) : (
        <div className="flex bar-width justify-between">
          <span>
            {value1 / 1000 > 1
              ? `${addCommas(value1 / 1000)}B`
              : `${addCommas(value1)}M`}
          </span>
          <span>
            {value2 === 0
              ? "∞"
              : value2 / 1000 > 1
              ? `${addCommas(value2 / 1000)}B`
              : `${addCommas(value2)}M`}
          </span>
        </div>
      )}
      <div className="bar-width h-2 rounded-lg dark:bg-slate-600 bg-gray-300">
        <div
          className="h-2 rounded-lg bg-violet-500"
          style={{
            width:
              value2 === 0
                ? "4%"
                : Number(value1) / Number(value2) < 0.04
                ? "4%"
                : Number(value2) < Number(value1)
                ? "100%"
                : `${(Number(value1) / Number(value2)) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};
