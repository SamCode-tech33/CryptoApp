"use client";

import Navcoin from "../components/Navcoin";
import Slidercoin from "../components/Slidercoin";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Coins() {
  return (
    <div>
      <div className="flex">
        <Link href="/coins" className="ml-16">
feature/the-carousel-of-coins
          <Button className="mr-4">Coins</Button>
        </Link>
        <Link href="/convertor">
          <Button className="ml-4">Convertor</Button>
=======
          <Button className="mr-4" asChild>
            Coins
          </Button>
        </Link>
        <Link href="/convertor">
          <Button className="ml-4" asChild>
            Convertor
          </Button>
main
        </Link>
      </div>
      <div className="flex justify-self-end">
        <Button className="mt-8 mr-16" asChild>
          Compare
        </Button>
      </div>
      <Slidercoin />
      <div className="flex mx-16 justify-between justify-left mt-8">
        <div className="h-80 w-half bg-slate-800 rounded-md">Graph</div>
        <div className="w-half h-80 bg-slate-800 rounded-md">Volume Graph</div>
      </div>
      <div className="flex ml-16 mt-12 justify-between bg-slate-800 px-3 py-1 rounded-md h-12 items-center w-1/4">
        <div className="bg-violet-400 py-1 rounded-md px-5">1D</div>
        <div className="py-1 rounded-md px-5">7D</div>
        <div className="py-1 rounded-md px-5">14D</div>
        <div className="py-1 rounded-md px-5">1M</div>
        <div className="py-1 rounded-md px-5">1W</div>
        <div className="py-1 rounded-md px-5">1Y</div>
        <div className="py-1 rounded-md px-5">5Y</div>
      </div>
      <Navcoin />
    </div>
  );
}
