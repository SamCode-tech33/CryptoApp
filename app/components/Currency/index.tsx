"use client";

import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { changeCurrency, changeCurrencySymbol } from "@/lib/currencySlice";

export function Currency() {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const currency = useSelector(
    (state: RootState) => state.currency.currencyType
  );

  const newCurrency = (e: any) => {
    dispatch(changeCurrency(e.target.innerText.split(" ")[1]));
    dispatch(changeCurrencySymbol(e.target.id));
  };

  return (
    <div className="relative mr-6">
      <button
        className="bg-slate-800 hover:bg-slate-600 py-2 px-3 rounded-sm flex items-center w-full"
        onClick={() => {
          setIsOpen(true);
        }}
        onBlur={() => {
          setTimeout(() => setIsOpen(false), 200);
        }}
      >
        <span className={currency === "USD" ? "mr-2" : "hidden"}>$</span>
        <span className={currency === "EUR" ? "mr-2" : "hidden"}>€</span>
        <span className={currency === "JPY" ? "mr-2" : "hidden"}>¥</span>
        <span className={currency === "BTC" ? "mr-2" : "hidden"}>₿</span>
        <span className={currency === "ETH" ? "mr-2" : "hidden"}>Ξ</span>
        <span>{currency}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="ml-2 h-4"
        >
          <path
            fillRule="evenodd"
            d={
              isOpen
                ? "M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
                : "M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
            }
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={
          isOpen
            ? "flex flex-col items-center bg-slate-800 absolute z-10 w-full rounded-sm border-gray-500 border"
            : "hidden"
        }
      >
        <div
          className="py-2 w-full hover:bg-slate-600 text-center cursor-pointer rounded-sm"
          onClick={newCurrency}
          id="$"
        >
          $ USD
        </div>
        <div
          className="py-2 w-full hover:bg-slate-600 text-center cursor-pointer rounded-sm"
          onClick={newCurrency}
          id="€"
        >
          € EUR
        </div>
        <div
          className="py-2 w-full hover:bg-slate-600 text-center cursor-pointer rounded-sm"
          onClick={newCurrency}
          id="¥"
        >
          ¥ JPY
        </div>
        <div
          className="py-2 w-full hover:bg-slate-600 text-center cursor-pointer rounded-sm"
          onClick={newCurrency}
          id="₿"
        >
          ₿ BTC
        </div>
        <div
          className="py-2 w-full hover:bg-slate-600 text-center cursor-pointer rounded-sm"
          onClick={newCurrency}
          id="Ξ"
        >
          Ξ ETH
        </div>
      </div>
    </div>
  );
}
