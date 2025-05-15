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
import { Skeleton } from "../components/Skeleton";
import { Notification } from "../components/notifications";

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
  const [convertedNum, setConvertedNum] = useState("0.000");
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
  const [errNoti, setErrNoti] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");
  const [convertAmount, setConvertAmount] = useState("");

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
    if (menuTriggerRight !== name) {
      setMenuTriggerLeft(name);
      setMenuIconLeft(id);
      setConvertAmount("");
      setConvertedNum("0.000");
    } else {
      setErrNoti(true);
      setNotiMessage("Cannot convert between same coin");
      setTimeout(() => {
        setNotiMessage("");
        setErrNoti(false);
      }, 2500);
    }
  };

  const changeMenuTriggerRight = (id: string, name: string) => {
    if (menuTriggerLeft !== name) {
      setMenuTriggerRight(name);
      setMenuIconRight(id);
      setConvertAmount("");
      setConvertedNum("0.000");
    } else {
      setErrNoti(true);
      setNotiMessage("Cannot convert between same coin");
      setTimeout(() => {
        setNotiMessage("");
        setErrNoti(false);
      }, 2500);
    }
  };

  const changePriceLeft = (coinPrice: any) => {
    setSelectedPriceLeft(coinPrice);
  };

  const changePriceRight = (coinPrice: any) => {
    setSelectedPriceRight(coinPrice);
  };

  const handleCalculate = () => {
    setConversionValue(convertAmount);
    const converted = (
      (Number(convertAmount) * Number(selectedPriceLeft.split(",").join(""))) /
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
        "py-1 rounded-md px-3 dark:hover:bg-violet-800 hover:bg-violet-300";
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
    <div className="lg:mx-36 md:mx-14 mx-4 mt-4">
      <Notification
        message={errNoti ? `Error: ${notiMessage}` : `Success: ${notiMessage}`}
        error={errNoti}
      />
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
            <div className="w-full dark:bg-slate-800 h-52 2xl:mr-4 rounded-md my-6 bg-white">
              <p className="lg:ml-10 ml-4 mt-4 mb-2 lg:text-lg text-base">
                You sell
              </p>
              <div className="border-b-2 border-gray-400 pb-2 lg:mx-8 mx-4 mb-2">
                <div className="dark:bg-slate-800 p-2.5 rounded-md flex justify-between items-center">
                  <div className="flex items-center justify-between relative w-2/3">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center mb-2">
                        <Defaulticon
                          coin={menuIconLeft}
                          height="md:h-6 h-4"
                          margin="mr-2"
                        />
                        <span className="md:text-base text-xs">
                          {menuTriggerLeft}
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Select Coin..."
                        value={searchTermLeft}
                        onChange={(e) => setSearchTermLeft(e.target.value)}
                        onFocus={() => setIsOpenLeft(true)}
                        onBlur={() =>
                          setTimeout(() => setIsOpenLeft(false), 200)
                        }
                        className="px-4 md:py-2 py-1 rounded-sm dark:bg-slate-600 dark:text-white dark:caret-white bg-gray-300 md:w-auto w-36"
                      />
                    </div>
                    <div
                      className={
                        isOpenLeft
                          ? "border absolute z-10 dark:bg-slate-900 overflow-y-scroll h-96 bg-slate-300 top-full w-5/6"
                          : "hidden"
                      }
                    >
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
                                {currencySymbol}
                                {coinPrice}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 md:text-base text-xs">
                      Enter Amount to Convert:
                    </div>
                    <input
                      type="text"
                      placeholder="Amount . . ."
                      value={convertAmount}
                      className="px-4 md:py-2 py-1 rounded-sm dark:bg-slate-600 dark:text-white dark:caret-white bg-gray-300 md:w-auto w-36"
                      onChange={(e) => {
                        handleCalculate();
                        setConvertAmount(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              {loading ? (
                <Skeleton classTail="h-6 dark:bg-slate-600 rounded-md flex justify-between bg-gray-300 mx-8" />
              ) : (
                <div className="flex justify-between mx-8">
                  <span>
                    1 {menuIconLeft} = {currencySymbol}
                    {selectedPriceLeft}
                  </span>
                  <span>
                    {convertedNum.length
                      ? `Value = ${currencySymbol}` +
                        addCommas(
                          Number(selectedPriceLeft.split(",").join("")) *
                            Number(conversionValue)
                        )
                      : ""}
                  </span>
                </div>
              )}
            </div>
            <div className="w-full dark:bg-slate-800 h-52 2xl:ml-4 rounded-md mb-6 2xl:mt-6 bg-white">
              <p className="lg:ml-10 ml-4 mt-4 mb-2 lg:text-lg text-base">
                You buy
              </p>
              <div className="border-b-2 border-gray-400 pb-2 lg:mx-8 mx-4 mb-2">
                <div className="dark:bg-slate-800 p-2.5 rounded-md flex justify-between items-center">
                  <div className="flex items-center justify-between relative w-2/3">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center mb-2">
                        <Defaulticon
                          coin={menuIconRight}
                          height="md:h-6 h-4"
                          margin="mr-2"
                        />
                        <span className="md:text-base text-xs">
                          {menuTriggerRight}
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Select Coin..."
                        value={searchTermRight}
                        onChange={(e) => setSearchTermRight(e.target.value)}
                        onFocus={() => setIsOpenRight(true)}
                        onBlur={() =>
                          setTimeout(() => setIsOpenRight(false), 200)
                        }
                        className="px-4 md:py-2 py-1 rounded-sm dark:bg-slate-600 dark:text-white dark:caret-white bg-gray-300 md:w-auto w-36"
                      />
                    </div>
                    <div
                      className={
                        isOpenRight
                          ? "border absolute z-10 dark:bg-slate-900 overflow-y-scroll h-96 bg-slate-300 top-full w-5/6"
                          : "hidden"
                      }
                    >
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
                                {currencySymbol}
                                {coinPrice}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="rounded-md p-2 text-right flex flex-col items-end">
                    <span className="mb-2 md:text-base text-xs">
                      Converted Amount:
                    </span>
                    <span className="md:text-base text-sm">
                      {convertedNum} {menuIconRight}
                    </span>
                  </div>
                </div>
              </div>
              {loading ? (
                <Skeleton classTail="h-6 dark:bg-slate-600 rounded-md flex justify-between bg-gray-300 mx-8" />
              ) : (
                <div className="flex justify-between mx-8">
                  <span>
                    1 {menuIconRight} = {currencySymbol}{selectedPriceRight}
                  </span>
                  <span>
                    {convertedNum.length
                      ? `Value = ${currencySymbol}` +
                        addCommas(
                          Number(selectedPriceRight.split(",").join("")) *
                            Number(convertedNum)
                        )
                      : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
          {load ? (
            <Skeleton classTail="h-72 dark:bg-slate-800 rounded-md flex justify-end flex-col w-full bg-gray-300" />
          ) : (
            <div className="h-72 dark:bg-slate-800 rounded-md flex justify-end flex-col w-full bg-white">
              {err && <p>There has been an error, please come back later</p>}

              <Linegraph
                coinHistory={coinHistory}
                limit={limit}
                rendered={rendered}
                coinName={menuIconLeft + " to " + menuIconRight}
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
            </div>
          )}
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
