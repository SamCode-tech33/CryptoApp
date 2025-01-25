"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [coins, setCoins] = useState([
    "Bitcoin",
    "Monero",
    "Avalanche",
    "Etherium",
  ]);
  const [value, setValue] = useState("");

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setCoins([...coins, value]);
    setValue("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleChange}
          value={value}
          style={{ color: "black" }}
        />
      </form>
      <ul>
        {coins.map((coin) => (
          <li key={coin}>
            <Link href={`/coin/${coin}`}>{coin}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
