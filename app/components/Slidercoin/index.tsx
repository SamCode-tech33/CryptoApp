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

export default function Slidercoin() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.coins
  );

  useEffect(() => {
    dispatch(fetchCoins());
  }, []);

  return (
    <div>
      {error && <p>Something went wrong, please try again later...</p>}
      {loading ? (
        <div>loading. . .</div>
      ) : (
        <div className="my-8 mx-16">
          <Slider {...sliderSettings}>
            {data.map((coin: any) => {
              const coinPrice = addCommas(coin.quote.USD.price);
              return (
                <div key={coin.id} className="h-24 rounded-md">
                  <div className="h-24 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md mx-2 flex justify-left items-center cursor-pointer">
                    <Defaulticon coin={coin} />
                    <div>
                      <div>
                        <span>{coin.name}</span>
                        <span> ({coin.symbol})</span>
                      </div>
                      <div className="flex">
                        <span className="mr-2">{coinPrice} USD</span>
                        <Updownarrow coin={coin} />
                        <span
                          className={
                            coin.quote.USD.percent_change_1h > 0
                              ? "text-green-500"
                              : "text-red-600"
                          }
                        >
                          {Math.abs(
                            coin.quote.USD.percent_change_1h.toFixed(2)
                          )}
                          %
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
