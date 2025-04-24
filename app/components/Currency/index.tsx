"use client";

import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { changeCurrency, changeCurrencySymbol } from "@/lib/currencySlice";
import { Uparrow } from "../svgComps";

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
    <div>
      <div className="relative mr-6">
        <button
          className="dark:bg-slate-800 dark:hover:bg-slate-600 py-2 px-3 rounded-sm flex items-center w-full bg-violet-300 hover:bg-violet-400"
          onClick={() => {
            setIsOpen(!isOpen);
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
          <Uparrow isOpen={isOpen} />
        </button>
        <div
          className={
            isOpen
              ? "flex flex-col items-center dark:bg-slate-800 absolute z-10 w-full rounded-sm border-gray-500 border bg-slate-300"
              : "hidden"
          }
        >
          <div
            className="py-2 w-full dark:hover:bg-slate-600 text-center cursor-pointer rounded-sm hover:bg-slate-400"
            onClick={newCurrency}
            id="$"
          >
            $ USD
          </div>
          <div
            className="py-2 w-full dark:hover:bg-slate-600 text-center cursor-pointer rounded-sm hover:bg-slate-400"
            onClick={newCurrency}
            id="€"
          >
            € EUR
          </div>
          <div
            className="py-2 w-full dark:hover:bg-slate-600 text-center cursor-pointer rounded-sm hover:bg-slate-400"
            onClick={newCurrency}
            id="¥"
          >
            ¥ JPY
          </div>
          <div
            className="py-2 w-full dark:hover:bg-slate-600 text-center cursor-pointer rounded-sm hover:bg-slate-400"
            onClick={newCurrency}
            id="₿"
          >
            ₿ BTC
          </div>
          <div
            className="py-2 w-full dark:hover:bg-slate-600 text-center cursor-pointer rounded-sm hover:bg-slate-400"
            onClick={newCurrency}
            id="Ξ"
          >
            Ξ ETH
          </div>
        </div>
      </div>
    </div>
  );
}
