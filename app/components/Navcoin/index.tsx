"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function Navcoin() {
  const [coins, setCoins] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const getCoins = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/coins");
      setCoins(data.data);
      setIsLoading(false);
      //eslint-disable-next-line
    } catch (error) {
      setError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCoins();
  }, []);

  return (
    <div>
      {error && <p>Something went wrong. Please try again later.</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {coins.map((coin: any) => (
            <li key={coin.id}>
              <Link href={`coins/${coin.name}`}>
                {coin.name}({coin.symbol}) ${coin.quote.USD.price.toFixed(2)}{" "}
                {coin.quote.USD.percent_change_1h.toFixed(3)}%{" "}
                {coin.quote.USD.percent_change_24h.toFixed(3)}%{" "}
                {coin.quote.USD.percent_change_7d.toFixed(3)}% $
                {coin.quote.USD.volume_24h.toFixed(3)} $
                {coin.quote.USD.market_cap.toFixed(3)} B
                {coin.circulating_supply} B{coin.max_supply}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
