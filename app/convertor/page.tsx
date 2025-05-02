"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchCoins } from "@/lib/coinsSlice";
import { Defaulticon, addCommas } from "../components/Utility";
import Linegraph from "../components/Linegraph";
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
      style = "py-1 rounded-md px-3 dark:bg-violet-800 bg-violet-300";
    } else {
      style =
        "py-1 rounded-md px-3 Hover:dark:bg-violet-800 hover:bg-violet-300";
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
    <div className="xl:mx-32 lg:mx-24 md:mx-8 mx-4">
      <div className="sm:flex w-full hidden">
        <Link href="/coins" className="mb-6">
          <button className="dark:bg-slate-800 p-3 rounded-sm dark:hover:bg-slate-600 lg:w-72 sm:w-48 bg-violet-300 hover:bg-violet-400">
            Coins
          </button>
        </Link>
        <Link href="/convertor">
          <div className="p-3 rounded-sm dark:bg-slate-600 lg:w-72 sm:w-48 bg-violet-400 text-center">
            Convertor
          </div>
        </Link>
      </div>
      {error ? (
        <span>There has been an error, please come back later</span>
      ) : (
        <div className="relative w-full">
          <div>
            <h1>Crypto Currency Convertor</h1>
            <p className="text-gray-500">{today}</p>
          </div>
          <div className="flex w-full justify-center items-center 2xl:flex-row flex-col">
            {loading && <div className="loading"></div>}
            <div className="w-full dark:bg-slate-800 h-52 2xl:mr-4 rounded-md my-6 bg-white">
              <p className="lg:ml-10 ml-4 mt-4 mb-4">You sell</p>
              <div className="border-b-2 border-gray-400 pb-4 lg:mx-8 mb-4 mx-4">
                <div className="flex justify-between items-center">
                  <button
                    className="dark:bg-slate-800 dark:hover:bg-slate-600 p-2.5 rounded-md bg-violet-300 hover:bg-violet-400"
                    onClick={() => setIsOpenLeft(!isOpenLeft)}
                  >
                    <div className="flex items-center justify-between">
                      <Defaulticon
                        coin={menuIconLeft}
                        height="h-8"
                        margin="mr-2"
                      />
                      <div className="flex items-center">
                        <span className="md:block hidden">
                          {menuTriggerLeft}
                        </span>
                        <span className="md:hidden block">
                          {menuTriggerLeft
                            .split(" ")[1]
                            .split("(")
                            .join("")
                            .split(")")
                            .join("")}
                        </span>
                        <Uparrow isOpen={isOpenLeft} />
                      </div>
                    </div>
                  </button>
                  <input
                    type="text"
                    value={conversionValue}
                    className="dark:bg-slate-600 rounded-md p-4 lg:h-12 h-8 lg:w-80 w-40 text-right dark:caret-white bg-white border-gray-600 border"
                    placeholder={menuIconLeft}
                    onChange={handleCalculate}
                  />
                </div>
                <div
                  className={
                    isOpenLeft
                      ? "border absolute z-10 dark:bg-slate-900 overflow-y-scroll h-96 bg-slate-300"
                      : "hidden"
                  }
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTermLeft}
                    onChange={(e) => setSearchTermLeft(e.target.value)}
                    className="w-full pl-10 pr-4 p-2 rounded-sm dark:bg-slate-800 dark:text-white dark:caret-white bg-white"
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
                          className="cursor-pointer dark:hover:bg-slate-600 p-2 flex justify-between hover:bg-slate-400"
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
                            <Defaulticon
                              coin={coin.symbol}
                              height="h-6"
                              margin="mr-2"
                            />
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
            <div className="w-full dark:bg-slate-800 h-52 2xl:ml-4 rounded-md mb-6 2xl:mt-6 bg-white">
              {loading && <div className="loading"></div>}
              <p className="lg:ml-10 ml-4 mt-4 mb-4">You buy</p>
              <div className="border-b-2 border-gray-400 pb-4 lg:mx-8 mx-4 mb-4">
                <div className="flex justify-between items-center">
                  <button
                    className="dark:bg-slate-800 dark:hover:bg-slate-600 p-2.5 rounded-md bg-violet-300 hover:bg-violet-400"
                    onClick={() => setIsOpenRight(!isOpenRight)}
                  >
                    <div className="flex items-center justify-between">
                      <Defaulticon
                        coin={menuIconRight}
                        height="h-8"
                        margin="mr-2"
                      />
                      <div className="flex items-center">
                        <span className="md:block hidden">
                          {menuTriggerRight}
                        </span>
                        <span className="md:hidden block">
                          {menuTriggerRight
                            .split(" ")[1]
                            .split("(")
                            .join("")
                            .split(")")
                            .join("")}
                        </span>
                        <Uparrow isOpen={isOpenRight} />
                      </div>
                    </div>
                    <span className="sr-only">Toggle theme</span>
                  </button>
                  <div className="dark:bg-slate-600 rounded-md p-4 lg:h-12 h-8 lg:w-80 w-40 text-right border border-gray-600 flex items-center justify-end">
                    <span>
                      {convertedNum} {menuIconRight}
                    </span>
                  </div>
                </div>
                <div
                  className={
                    isOpenRight
                      ? "border absolute z-10 dark:bg-slate-900 overflow-y-scroll h-96 bg-slate-300"
                      : "hidden"
                  }
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTermRight}
                    onChange={(e) => setSearchTermRight(e.target.value)}
                    className="w-full pl-10 pr-4 p-2 rounded-sm dark:bg-slate-800 dark:text-white dark:caret-white bg-white"
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
                          className="cursor-pointer dark:hover:bg-slate-600 p-2 flex justify-between hover:bg-slate-400"
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
                            <Defaulticon
                              coin={coin.symbol}
                              height="h-6"
                              margin="mr-2"
                            />
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
          <div className="h-72 dark:bg-slate-800 rounded-md flex justify-end flex-col w-full bg-white">
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
          <div className="flex my-6 justify-between dark:bg-slate-800 p-2 rounded-md h-12 items-center lg:w-80 xl:w-96 bg-white">
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
