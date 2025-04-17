"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchCoins } from "@/lib/coinsSlice";
import { Defaulticon, addCommas } from "../components/Utility";
import { Linegraph } from "../components/Linegraph";
import axios from "axios";
import { changeGraph } from "@/lib/symbolSlice";
import { changeTimePeriod } from "@/lib/timeSlice";
import { Uparrow } from "../components/svgComps";

export default function Convertor() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.coins
  );
  const time = useSelector((state: RootState) => state.timePeriod.time);
  const aggre = useSelector((state: RootState) => state.timePeriod.aggre);
  const limit = useSelector((state: RootState) => state.timePeriod.limit);
  const currency = useSelector(
    (state: RootState) => state.currency.currencyType
  );
  const currencySymbol = useSelector(
    (state: RootState) => state.currency.currencySymbol
  );

  const [menuTriggerLeft, setMenuTriggerLeft] = useState("Bitcoin (BTC)");
  const [menuIconLeft, setMenuIconLeft] = useState("BTC");
  const [menuTriggerRight, setMenuTriggerRight] = useState("Ethereum (ETH)");
  const [menuIconRight, setMenuIconRight] = useState("ETH");
  const [selectedPriceLeft, setSelectedPriceLeft] = useState<string>("");
  const [selectedPriceRight, setSelectedPriceRight] = useState<string>("");
  const [convertedNum, setConvertedNum] = useState("");
  const [today, setToday] = useState("");
  const [selectedTime, setSelectedTime] = useState<string>("minutes 5 288");
  const [load, setLoad] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [err, setErr] = useState(false);
  const [coinHistory, setCoinHistory] = useState<any>([]);
  const [conversionValue, setConversionValue] = useState("");
  const [isOpenLeft, setIsOpenLeft] = useState<boolean>(false);
  const [isOpenRight, setIsOpenRight] = useState<boolean>(false);
  const [searchTermLeft, setSearchTermLeft] = useState("");
  const [searchTermRight, setSearchTermRight] = useState("");

  const getCoinsHistory = async (symbol: string) => {
    setLoad(true);
    setRendered(false);
    try {
      if (symbol.length) {
        const { data } = await axios.get(
          `/api/historical?instrument=${menuIconLeft}-${menuIconRight}&timeperiod=${time}&aggre=${aggre}&limit=${limit}`
        );
        setCoinHistory(data.Data);
      }
      //eslint-disable-next-line
    } catch (error) {
      setErr(true);
      setLoad(false);
    }
    setLoad(false);
  };

  const changeMenuTriggerLeft = (id: string, name: string) => {
    setMenuTriggerLeft(name);
    setMenuIconLeft(id);
  };

  const changeMenuTriggerRight = (id: string, name: string) => {
    setMenuTriggerRight(name);
    setMenuIconRight(id);
  };

  const changePriceLeft = (coinPrice: any) => {
    setSelectedPriceLeft(coinPrice);
  };

  const changePriceRight = (coinPrice: any) => {
    setSelectedPriceRight(coinPrice);
  };

  const handleCalculate = (e: any) => {
    setConversionValue(e.target.value);
    const converted = (
      (e.target.value * Number(selectedPriceLeft.split(",").join(""))) /
      Number(selectedPriceRight.split(",").join(""))
    ).toFixed(3);
    setConvertedNum(converted);
  };

  const handleClick = (symbol: string) => {
    dispatch(changeGraph(symbol));
  };

  const handleTime = (e: any) => {
    const [time, aggre, limit] = e.target.id.split(" ");
    setSelectedTime(e.target.id);
    const newPeriod = {
      time: time,
      aggre: aggre,
      limit: limit,
    };
    dispatch(changeTimePeriod(newPeriod));
  };

  const isSelected = (id: string) => {
    let style = "";
    if (selectedTime === id) {
      style = "py-1 rounded-md px-5 bg-violet-800";
    } else {
      style = "py-1 rounded-md px-5";
    }
    return style;
  };

  const apiLoaded = async () => {
    await getCoinsHistory(menuIconLeft);
    setRendered(true);
  };

  useEffect(() => {
    if (data.length > 0) {
      const leftCoin = data.find((coin) => coin.symbol === menuIconLeft);
      const rightCoin = data.find((coin) => coin.symbol === menuIconRight);
      const leftPrice = leftCoin?.quote?.[currency]?.price;
      const rightPrice = rightCoin?.quote?.[currency]?.price;

      if (leftPrice && rightPrice) {
        setSelectedPriceLeft(addCommas(leftPrice).toString());
        setSelectedPriceRight(addCommas(rightPrice).toString());
      }
    }
  }, [data, currency, menuIconLeft, menuIconRight]);

  useEffect(() => {
    dispatch(fetchCoins({ start: 1, limit: 1000, convert: currency }));
    setToday(new Date().toString().split("G")[0]);
  }, [currency]);

  useEffect(() => {
    getCoinsHistory(menuIconLeft);
    apiLoaded();
  }, [menuIconLeft, selectedTime, menuIconRight, currency]);

  return (
    <div>
      <div className="flex mx-32">
        <Link href="/coins" className="mb-6">
          <button className="bg-slate-800 p-3 rounded-sm hover:bg-slate-600 w-72">
            Coins
          </button>
        </Link>
        <Link href="/convertor">
          <button className="p-3 rounded-sm bg-slate-600 w-72">
            Convertor
          </button>
        </Link>
      </div>
      {error ? (
        <span>There has been an error, please come back later</span>
      ) : (
        <div className="relative">
          <div className="mx-32">
            <h1>Crypto Currency Convertor</h1>
            <p className="text-gray-500">{today}</p>
          </div>
          <div className="mx-32 flex">
            {loading && <div className="loading"></div>}
            <div className="w-half bg-slate-800 h-52 mr-4 rounded-md mt-6 mb-6">
              <p className="ml-10 mt-4 mb-8">You sell</p>
              <div className="border-b-2 border-gray-400 pb-4 mx-8 mb-4">
                <div className="flex justify-between">
                  <button
                    className="bg-slate-800 hover:bg-slate-600 p-2.5 rounded-md"
                    onClick={() => setIsOpenLeft(!isOpenLeft)}
                  >
                    <div className="flex items-center justify-between w-56">
                      <Defaulticon coin={menuIconLeft} height="h-8" />
                      <div className="flex items-center">
                        <span>{menuTriggerLeft}</span>
                        <Uparrow isOpen={isOpenLeft} />
                      </div>
                    </div>
                    <span className="sr-only">Toggle theme</span>
                  </button>
                  <input
                    type="text"
                    value={conversionValue}
                    className="bg-slate-600 rounded-md p-4 h-12 w-80 text-right caret-white"
                    placeholder={menuIconLeft}
                    onChange={handleCalculate}
                  />
                </div>
                <div
                  className={
                    isOpenLeft
                      ? "border absolute z-10 bg-slate-900 overflow-y-scroll h-96"
                      : "hidden"
                  }
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTermLeft}
                    onChange={(e) => setSearchTermLeft(e.target.value)}
                    className="w-full pl-10 pr-4 p-2 rounded-sm bg-slate-800 text-white dark:caret-white"
                  />
                  {data
                    .filter((coin) =>
                      coin.name
                        .toLowerCase()
                        .includes(searchTermLeft.toLowerCase())
                    )
                    .map((coin) => {
                      if (!coin.quote?.[currency]) {
                        return null;
                      }
                      let coinQuote;
                      if (coin.quote?.[currency]) {
                        coinQuote = coin.quote?.[currency];
                      } else {
                        coinQuote = coin.quote.USD;
                      }
                      const coinPrice = addCommas(coinQuote.price);
                      return (
                        <div
                          className="cursor-pointer hover:bg-slate-600 p-2 flex justify-between"
                          key={coin.symbol + coin.id}
                          id={coin.symbol}
                          onClick={() => {
                            const id = coin.symbol;
                            const name =
                              coin.name + " " + "(" + coin.symbol + ")";
                            changeMenuTriggerLeft(id, name);
                            changePriceLeft(coinPrice);
                            handleClick(id);
                          }}
                        >
                          <div className="flex items-center">
                            <Defaulticon coin={coin.symbol} height="h-6" />
                            <span>
                              {coin.name} ({coin.symbol})
                            </span>
                          </div>
                          <span>
                            {currencySymbol} {coinPrice}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="flex justify-between mx-8">
                <span>
                  1 {menuIconLeft} = {currencySymbol} {selectedPriceLeft}
                </span>
                <span>
                  {convertedNum.length
                    ? `Value = ${currencySymbol} ` +
                      addCommas(
                        Number(selectedPriceRight.split(",").join("")) *
                          Number(convertedNum)
                      )
                    : ""}
                </span>
              </div>
            </div>
            <div className="w-half bg-slate-800 h-52 ml-4 rounded-md  mt-6 mb-6">
              {loading && <div className="loading"></div>}
              <p className="ml-8 mt-4 mb-8">You buy</p>
              <div className="border-b-2 border-gray-400 pb-4 mx-8 mb-4">
                <div className="flex justify-between">
                  <button
                    className="bg-slate-800 hover:bg-slate-600 p-2.5 rounded-md"
                    onClick={() => setIsOpenRight(!isOpenRight)}
                  >
                    <div className="flex items-center justify-between w-56">
                      <Defaulticon coin={menuIconRight} height="h-8" />
                      <div className="flex items-center">
                        <span>{menuTriggerRight}</span>
                        <Uparrow isOpen={isOpenRight} />
                      </div>
                    </div>
                    <span className="sr-only">Toggle theme</span>
                  </button>
                  <div className="bg-slate-600 rounded-md p-4 h-12 w-80 text-right">
                    {convertedNum} {menuIconRight}
                  </div>
                </div>
                <div
                  className={
                    isOpenRight
                      ? "border absolute z-10 bg-slate-900 overflow-y-scroll h-96"
                      : "hidden"
                  }
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTermRight}
                    onChange={(e) => setSearchTermRight(e.target.value)}
                    className="w-full pl-10 pr-4 p-2 rounded-sm bg-slate-800 text-white dark:caret-white"
                  />
                  {data
                    .filter((coin) =>
                      coin.name
                        .toLowerCase()
                        .includes(searchTermRight.toLowerCase())
                    )
                    .map((coin) => {
                      if (!coin.quote?.[currency]) {
                        return null;
                      }
                      let coinQuote;
                      if (coin.quote?.[currency]) {
                        coinQuote = coin.quote?.[currency];
                      } else {
                        coinQuote = coin.quote.USD;
                      }
                      const coinPrice = addCommas(coinQuote.price);
                      return (
                        <div
                          className="cursor-pointer hover:bg-slate-600 p-2 flex justify-between"
                          key={coin.symbol + coin.id}
                          onClick={() => {
                            const id = coin.symbol;
                            const name =
                              coin.name + " " + "(" + coin.symbol + ")";
                            changeMenuTriggerRight(id, name);
                            changePriceRight(coinPrice);
                            handleClick(id);
                          }}
                        >
                          <div className="flex items-center">
                            <Defaulticon coin={coin.symbol} height="h-6" />
                            <span>
                              {coin.name} ({coin.symbol})
                            </span>
                          </div>
                          <span>
                            {currencySymbol} {coinPrice}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="flex justify-between mx-8">
                <span>
                  1 {menuIconRight} = {currencySymbol} {selectedPriceRight}
                </span>
                <span>
                  {convertedNum.length
                    ? `Value = ${currencySymbol} ` +
                      addCommas(
                        Number(selectedPriceRight.split(",").join("")) *
                          Number(convertedNum)
                      )
                    : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="h-72 bg-slate-800 rounded-md flex justify-end flex-col mx-32 w-all">
            {load && <div className="loading"></div>}
            {err ? (
              <span>There has been an error, please come back later</span>
            ) : (
              <Linegraph
                coinHistory={coinHistory}
                limit={limit}
                rendered={rendered}
                symbol={menuIconLeft}
                selectedTime={selectedTime}
                coinCompare={[]}
                compare={""}
                loading={load}
                today={today}
                currency={menuIconRight}
                compareHidden={true}
                onConverter={true}
                rightSym={menuIconRight}
              />
            )}
          </div>
          <div className="flex ml-32 mt-6 justify-between bg-slate-800 px-3 py-1 rounded-md h-12 items-center w-1/4">
            <button
              onClick={handleTime}
              id="minutes 5 288"
              className={isSelected("minutes 5 288")}
            >
              1D
            </button>
            <button
              onClick={handleTime}
              id="hours 1 168"
              className={isSelected("hours 1 168")}
            >
              7D
            </button>
            <button
              onClick={handleTime}
              id="hours 1 336"
              className={isSelected("hours 1 336")}
            >
              14D
            </button>
            <button
              onClick={handleTime}
              id="hours 2 360"
              className={isSelected("hours 2 360")}
            >
              30D
            </button>
            <button
              onClick={handleTime}
              id="days 1 365"
              className={isSelected("days 1 365")}
            >
              1Y
            </button>
            <button
              onClick={handleTime}
              id="days 4 457"
              className={isSelected("days 4 457")}
            >
              5Y
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
