export const addCommas = (num: number) => {
  if (num === null) {
    num = 0;
  }
  const coinPriceArray = num.toFixed(0).split("");
  const decimals = num.toFixed(2);
  const coinDecimals = decimals.slice(decimals.length - 3);
  const coinPriceCommas = coinPriceArray.map((num: any, i: number) => {
    const commaSpot = (coinPriceArray.length - (i + 1)) % 3;
    if (commaSpot === 0 && i !== coinPriceArray.length - 1) {
      num = num + ",";
    }
    return num;
  });
  if (num === 0) {
    return "Infinite";
  } else {
    return coinPriceCommas.join("") + coinDecimals;
  }
};
