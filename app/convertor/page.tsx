"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchCoins } from "@/lib/coinsSlice";
import { Defaulticon, addCommas } from "../components/Utility";
import { Linegraph } from "../components/Linegraph";
import axios from "axios";
import { changeGraph } from "@/lib/symbolSlice";
import { changeTimePeriod } from "@/lib/timeSlice";

export default function Convertor() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.coins
  );
  const time = useSelector((state: RootState) => state.timePeriod.time);
  const aggre = useSelector((state: RootState) => state.timePeriod.aggre);
  const limit = useSelector((state: RootState) => state.timePeriod.limit);

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

  const getCoinsHistory = async (symbol: string) => {
    setLoad(true);
    setRendered(false);
    try {
      if (symbol.length) {
        const { data } = await axios.get(
          `/api/historical?instrument=${menuIconLeft}&timeperiod=${time}&aggre=${aggre}&limit=${limit}`
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

  const changeMenuTriggerLeft = (e: any) => {
    setMenuTriggerLeft(e.target.innerText);
    const symbolPara =
      e.target.innerText.split(" ")[e.target.innerText.split(" ").length - 1];
    setMenuIconLeft(symbolPara.slice(1, symbolPara.length - 1));
  };

  const changeMenuTriggerRight = (e: any) => {
    setMenuTriggerRight(e.target.innerText);
    const symbolPara =
      e.target.innerText.split(" ")[e.target.innerText.split(" ").length - 1];
    setMenuIconRight(symbolPara.slice(1, symbolPara.length - 1));
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
    if (data.length > 2) {
      const priceLeft = addCommas(data[0].quote.USD.price);
      const priceRight = addCommas(data[1].quote.USD.price);
      setSelectedPriceLeft(priceLeft.toString());
      setSelectedPriceRight(priceRight.toString());
    }
  }, [data]);

  useEffect(() => {
    dispatch(fetchCoins());
    setToday(new Date().toString().split("G")[0]);
  }, [dispatch]);

  useEffect(() => {
    getCoinsHistory(menuIconLeft);
    apiLoaded();
  }, [menuIconLeft, selectedTime, selectedPriceRight]);

  return (
    <div>
      <div className="flex mx-18">
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
        <div>
          <div className="mx-18">
            <h1>Crypto Currency Convertor</h1>
            <p className="text-gray-500">{today}</p>
          </div>
          <div className="mx-18 flex">
            {loading && <span>Loading...</span>}
            <div className="w-half bg-slate-800 h-52 mr-4 rounded-md mt-6 mb-6">
              <p className="ml-10 mt-4 mb-8">You sell</p>
              <div className="border-b-2 border-gray-400 pb-4 mx-8 mb-4">
                <DropdownMenu>
                  <div className="flex justify-between">
                    <DropdownMenuTrigger asChild>
                      <button className="bg-slate-800 hover:bg-slate-600 p-2.5 rounded-md">
                        <div className="flex items-center">
                          <Defaulticon coin={menuIconLeft} />
                          <span>{menuTriggerLeft}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="ml-2 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="sr-only">Toggle theme</span>
                      </button>
                    </DropdownMenuTrigger>
                    <input
                      type="text"
                      value={conversionValue}
                      className="bg-slate-600 rounded-md p-4 h-12 w-80 text-right"
                      placeholder={menuIconLeft}
                      onChange={handleCalculate}
                    />
                  </div>
                  <DropdownMenuContent align="end">
                    {data.map((coin) => {
                      return (
                        <DropdownMenuItem
                          key={coin.symbol}
                          onClick={(e) => {
                            const coinPrice = addCommas(coin.quote.USD.price);
                            const id = coin.symbol;
                            changeMenuTriggerLeft(e);
                            changePriceLeft(coinPrice);
                            handleClick(id);
                          }}
                        >
                          {coin.name} ({coin.symbol})
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex justify-between mx-8">
                <span>
                  1 {menuIconLeft} = ${selectedPriceLeft}
                </span>
                <span>
                  {convertedNum.length
                    ? "Value = $" +
                      addCommas(
                        Number(selectedPriceRight.split(",").join("")) *
                          Number(convertedNum)
                      )
                    : ""}
                </span>
              </div>
            </div>
            <div className="w-half bg-slate-800 h-52 ml-4 rounded-md  mt-6 mb-6">
              {loading && <span>Loading...</span>}
              <p className="ml-8 mt-4 mb-8">You buy</p>
              <div className="border-b-2 border-gray-400 pb-4 mx-8 mb-4">
                <DropdownMenu>
                  <div className="flex justify-between">
                    <DropdownMenuTrigger asChild>
                      <button className="bg-slate-800 hover:bg-slate-600 p-2.5 rounded-md">
                        <div className="flex items-center">
                          <Defaulticon coin={menuIconRight} />
                          <span>{menuTriggerRight}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="ml-2 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="sr-only">Toggle theme</span>
                      </button>
                    </DropdownMenuTrigger>
                    <div className="bg-slate-600 rounded-md p-4 h-12 w-80 text-right">
                      {convertedNum} {menuIconRight}
                    </div>
                  </div>
                  <DropdownMenuContent align="end">
                    {data.map((coin) => {
                      return (
                        <DropdownMenuItem
                          key={coin.symbol}
                          onClick={(e) => {
                            const coinPrice = addCommas(coin.quote.USD.price);
                            changeMenuTriggerRight(e);
                            changePriceRight(coinPrice);
                          }}
                        >
                          {coin.name} ({coin.symbol})
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex justify-between mx-8">
                <span>
                  1 {menuIconRight} = ${selectedPriceRight}
                </span>
                <span>
                  {convertedNum.length
                    ? "Value = $" +
                      addCommas(
                        Number(selectedPriceRight.split(",").join("")) *
                          Number(convertedNum)
                      )
                    : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="h-82 w-all bg-slate-800 rounded-md flex justify-end flex-col ml-18">
            {load && <span>Loading...</span>}
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
                selectedPriceRight={selectedPriceRight}
                compareHidden={true}
              />
            )}
          </div>
          <div className="flex ml-18 mt-6 justify-between bg-slate-800 px-3 py-1 rounded-md h-12 items-center w-1/4">
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
