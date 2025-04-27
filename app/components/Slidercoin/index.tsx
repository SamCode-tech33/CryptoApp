"use client";

import { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  addCommas,
  Updownarrow,
  sliderSettings,
  Defaulticon,
} from "../Utility";
import { useSelector, useDispatch } from "react-redux";
import { fetchCoins } from "@/lib/coinsSlice";
import { RootState, AppDispatch } from "@/lib/store";
import { changeGraph } from "@/lib/symbolSlice";

export default function Slidercoin() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.coins
  );

  const symbol = useSelector((state: RootState) => state.symbol.sym);
  const compare = useSelector((state: RootState) => state.symbol.compare);
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  const currency = useSelector(
    (state: RootState) => state.currency.currencyType
  );
  const currencySymbol = useSelector(
    (state: RootState) => state.currency.currencySymbol
  );

  const handleClick = (e: any) => {
    dispatch(changeGraph(e.currentTarget.id));
  };

  useEffect(() => {
    dispatch(fetchCoins({ start: 1, limit: 400, convert: currency }));
  }, [currency]);

  return (
    <div>
      {error ? (
        <p>The following {error} occured, please try again later...</p>
      ) : (
        <div className="lg-mx-22 relative my-5">
          <Slider {...sliderSettings}>
            {loading && <div className="loading"></div>}
            {data
              .filter((coin) =>
                coin.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((coin: any) => {
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
                    key={coin.id}
                    id={coin.symbol}
                    className="h-24 rounded-md"
                    onClick={handleClick}
                  >
                    <div
                      className={
                        coin.symbol === symbol || coin.symbol === compare
                          ? "h-24 dark:bg-slate-600 rounded-md flex mx-2 justify-between px-3 items-center bg-violet-300"
                          : "h-24 dark:bg-slate-800 dark:hover:bg-slate-600 rounded-md mx-2 flex justify-between px-3 items-center cursor-pointer bg-white hover:bg-violet-300"
                      }
                    >
                      <div className="sm:flex items-center">
                        <Defaulticon coin={coin.symbol} height="h-8" />
                        <span className="block 2xl:hidden text-sm sm:text-base">
                          {coin.symbol}
                        </span>
                      </div>
                      <div className="">
                        <div className="2xl:block hidden">
                          <span>{coin.name}</span>
                          <span> ({coin.symbol})</span>
                        </div>
                        <div className="2xl:flex">
                          <div className="2xl:mr-2 text-sm sm:text-base">
                            {currencySymbol}
                            {coinPrice}
                          </div>
                          <div className="flex justify-end">
                            <Updownarrow coin={coinQuote.percent_change_1h} />
                            <span
                              className={
                                coinQuote.percent_change_1h > 0
                                  ? "text-green-500 text-sm sm:text-base"
                                  : "text-red-600 text-sm sm:text-base"
                              }
                            >
                              {Math.abs(coinQuote.percent_change_1h.toFixed(2))}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </Slider>
        </div>
      )}
    </div>
  );
}
