"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { addCommas, Updownarrow, sliderSettings, Defaulticon } from "../Utility";

export default function Slidercoin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [sliderCoins, setSliderCoins] = useState<any>([]);

  const getSliderCoins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/coins");
      setSliderCoins(data.data);
      //eslint-disable-next-line
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    getSliderCoins();
  }, []);

  return (
    <div>
      {error && <p>Something went wrong, please try again later...</p>}
      {loading ? (
        <div>loading. . .</div>
      ) : (
        <div className="my-8 mx-16">
          <Slider {...sliderSettings}>
            {sliderCoins.map((coin: any) => {
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
                        <Updownarrow coin={coin}/>
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
