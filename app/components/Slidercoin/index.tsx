"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { addCommas } from "../Utility";
import { handleImageError } from "../Utility";
import { sliderSettings } from "../Utility";

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
                    <img
                      id="currentPhoto"
                      src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                      alt=""
                      onError={handleImageError}
                      className="h-8 mx-4"
                    />
                    <div>
                      <h1>
                        {coin.name} ({coin.symbol})
                      </h1>
                      <span className="mr-2">{coinPrice} USD</span>
                      <span>
                        {coin.quote.USD.percent_change_1h.toFixed(2)}%
                      </span>
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
