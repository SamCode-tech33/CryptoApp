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
    dispatch(fetchCoins({ start: 1, limit: 1000, convert: currency }));
  }, [currency]);

  return (
    <div>
      {error ? (
        <p>The following {error} occured, please try again later...</p>
      ) : (
        <div className="my-6 mx-16 relative">
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
                          ? "h-24 dark:bg-slate-600 dark:hover:bg-slate-600 rounded-md mx-2 flex justify-left items-center"
                          : "h-24 dark:bg-slate-800 dark:hover:bg-slate-600 rounded-md mx-2 flex justify-left items-center cursor-pointer"
                      }
                    >
                      <div className="ml-4"></div>
                      <Defaulticon coin={coin.symbol} height="h-8" />
                      <div>
                        <div>
                          <span>{coin.name}</span>
                          <span> ({coin.symbol})</span>
                        </div>
                        <div className="flex">
                          <span className="mr-2">
                            {currencySymbol} {coinPrice}
                          </span>
                          <Updownarrow coin={coinQuote.percent_change_1h} />
                          <span
                            className={
                              coinQuote.percent_change_1h > 0
                                ? "text-green-500"
                                : "text-red-600"
                            }
                          >
                            {Math.abs(coinQuote.percent_change_1h.toFixed(2))}%
                          </span>
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
