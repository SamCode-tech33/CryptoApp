"use client";
import React from "react";
import Link from "next/link";

export default function Convertor() {
  return (
    <div>
      <div className="flex mx-18">
        <Link href="/coins">
          <button className="bg-slate-800 p-3 rounded-sm hover:bg-slate-600 w-72">
            Coins
          </button>
        </Link>
        <Link href="/convertor">
          <button className="p-3 rounded-sm bg-slate-600 w-72">
            Convertor
          </button>
        </Link>
      </div>
    </div>
  );
}
