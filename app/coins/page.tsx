"use client";
import Navcoin from "../components/Navcoin";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Coins() {
  return (
    <div>
      <div className="flex">
        <Link href="/coins" className="ml-16">
          <Button className="mr-4" asChild>
            Coins
          </Button>
        </Link>
        <Link href="/convertor">
          <Button className="ml-4" asChild>
            Convertor
          </Button>
        </Link>
      </div>
      <div className="flex justify-self-end">
        <Button className="mt-8 mr-16" asChild>
          Compare
        </Button>
      </div>
      <div
        id="default-carousel"
        className="h-32 flex my-8 mx-16 bg-slate-800"
        data-carousel="slide"
      >
        <div>Carousel</div>
      </div>
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
