export const Coinbar = ({
  currencySymbol,
  value1,
  value2,
  colorLoad,
  colors,
  index,
  coinQuote,
  first,
}: any) => {
  return (
    <div className="w-72 flex justify-left flex-col">
      {first === true ? (
        <div className="flex w-64 justify-between">
          <span>
            {currencySymbol}
            {value1}B
          </span>
          <span>
            {currencySymbol}
            {value2}B
          </span>
        </div>
      ) : (
        <div className="flex w-64 justify-between">
          <span>{value1}M</span>
          <span className={value2 === "0" ? "text-2xl" : value2 + ""}>
            {value2 === "0" ? "∞" : value2 + "M"}
          </span>
        </div>
      )}
      {colorLoad ? (
        <div className="loading"></div>
      ) : (
        <div
          className="w-64 h-2 rounded-lg"
          style={{
            backgroundColor: `rgba(${colors[index]}, 0.5)`,
          }}
        >
          <div
            className="h-2 rounded-lg"
            style={{
              width:
                coinQuote.volume_24h > coinQuote.market_cap
                  ? "20rem"
                  : `${(coinQuote.volume_24h / coinQuote.market_cap) * 100}%`,
              backgroundColor: `rgba(${colors[index]}, 1)`,
            }}
          ></div>
        </div>
      )}
    </div>
  );
};
