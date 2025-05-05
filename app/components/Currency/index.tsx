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

  const newCurrency = (id: any) => {
    dispatch(changeCurrency(id.split(" ")[1]));
    dispatch(changeCurrencySymbol(id.split(" ")[0]));
  };

  return (
    <div>
      <div className="relative md:mr-6 mr-2">
        <button
          className="dark:bg-slate-800 dark:hover:bg-slate-600 py-2 sm:px-3 px-2 rounded-sm flex items-center w-full bg-violet-300 hover:bg-violet-400"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 200);
          }}
        >
          <span className={currency === "USD" ? "lg:mr-2" : "hidden"}>$</span>
          <span className={currency === "EUR" ? "lg:mr-2" : "hidden"}>€</span>
          <span className={currency === "JPY" ? "lg:mr-2" : "hidden"}>¥</span>
          <span className={currency === "BTC" ? "lg:mr-2" : "hidden"}>₿</span>
          <span className={currency === "ETH" ? "lg:mr-2" : "hidden"}>Ξ</span>
          <span className="lg:block hidden">{currency}</span>
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
            className="py-2 w-full dark:hover:bg-slate-600 text-center cursor-pointer rounded-sm hover:bg-slate-400 flex justify-center"
            onClick={() => {
              const id = "$ USD";
              newCurrency(id);
            }}
          >
            <span className="lg:mr-2">$</span>
            <span className="lg:block hidden">USD</span>
          </div>
          <div
            className="py-2 w-full dark:hover:bg-slate-600 text-center cursor-pointer rounded-sm hover:bg-slate-400 flex justify-center"
            onClick={() => {
              const id = "€ EUR";
              newCurrency(id);
            }}
          >
            <span className="lg:mr-2">€</span>
            <span className="lg:block hidden">EUR</span>
          </div>
          <div
            className="py-2 w-full dark:hover:bg-slate-600 text-center cursor-pointer rounded-sm hover:bg-slate-400 flex justify-center"
            onClick={() => {
              const id = "¥ JPY";
              newCurrency(id);
            }}
          >
            <span className="lg:mr-2">¥</span>
            <span className="lg:block hidden">JPY</span>
          </div>
          <div
            className="py-2 w-full dark:hover:bg-slate-600 text-center cursor-pointer rounded-sm hover:bg-slate-400 flex justify-center"
            onClick={() => {
              const id = "₿ BTC";
              newCurrency(id);
            }}
          >
            <span className="lg:mr-2">₿</span>
            <span className="lg:block hidden">BTC</span>
          </div>
          <div
            className="py-2 w-full dark:hover:bg-slate-600 text-center cursor-pointer rounded-sm hover:bg-slate-400 flex justify-center"
            onClick={() => {
              const id = "Ξ ETH";
              newCurrency(id);
            }}
          >
            <span className="lg:mr-2">Ξ</span>
            <span className="lg:block hidden">ETH</span>
          </div>
        </div>
      </div>
    </div>
  );
}
