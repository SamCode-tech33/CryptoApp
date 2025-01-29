"use client";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Coin({ params }: any) {
  const coinId: any = React.use(params);
  const [coin, setCoin] = useState<any>({});
  const [rendered, setRendered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getCoin = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/coins");
      setCoin(data.data.find((coin: any) => coin.name === coinId.coinId));
      //eslint-disable-next-line
    } catch (error) {
      setError(true);
    }
    setLoading(false);
    setRendered(true);
  };

  useEffect(() => {
    getCoin();
  }, [loading]);

  return (
    <div>
      {loading && <div>Loading. . .</div>}
      {error ? (
        <p>
          The following error has occured: {error}, please try again later. . .
        </p>
      ) : (
        <div>
          {rendered && (
            <div className="coin-wrapper">
              <div>
                {coin.name}({coin.symbol})
              </div>
              <br />
              <div>
                ${coin.quote.USD.price.toFixed(2)}{" "}
                {coin.quote.USD.percent_change_1h.toFixed(2)}%
              </div>
              <div>
                Profit: $
                {(
                  coin.quote.USD.price.toFixed(2) *
                  coin.quote.USD.percent_change_1h.toFixed(2)
                ).toFixed(2)}
              </div>
              <br />
              <div>Total Volume: {coin.quote.USD.volume_24h.toFixed(3)}</div>
              <div>Market Cap: ${coin.quote.USD.market_cap.toFixed(3)}</div>
              <br />
              <div>Circulating Supply: B{coin.circulating_supply}</div>
              <div>Max Supply: B{coin.max_supply}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
