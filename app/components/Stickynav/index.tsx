import Link from "next/link";
import { Homeicon, Rightleftarrows, Portfolioicon } from "../svgComps";

export const Stickynav = () => {
  return (
    <div className="sticky-nav dark:bg-slate-900 bg-slate-300 px-3 py-1">
      <div className="flex justify-between items-center sm:hidden">
        <Link
          href="/"
          className={
            location.pathname === "/"
              ? "xl:mx-6 flex flex-col items-center sm:mx-2 mx-1 cursor-pointer bg-slate-700 p-4 w-full rounded-md"
              : "xl:mx-6 flex flex-col items-center sm:mx-2 mx-1 cursor-pointer hover:bg-slate-700 p-4 w-full rounded-md"
          }
        >
          <Homeicon />
          <span className="">Home</span>
        </Link>
        <Link
          href="/convertor"
          className={
            location.pathname === "/convertor"
              ? "xl:mx-6 flex flex-col items-center sm:mx-2 mx-1 cursor-pointer bg-slate-700 p-4 w-full rounded-md"
              : "xl:mx-6 flex flex-col items-center sm:mx-2 mx-1 cursor-pointer hover:bg-slate-700 p-4 w-full rounded-md"
          }
        >
          <Rightleftarrows />
          <span className="">Convertor</span>
        </Link>
        <Link
          href="/portfolio"
          className={
            location.pathname === "/portfolio"
              ? "xl:mx-6 flex flex-col items-center sm:mx-2 mx-1 cursor-pointer bg-slate-700 p-4 w-full rounded-md"
              : "xl:mx-6 flex flex-col items-center sm:mx-2 mx-1 cursor-pointer hover:bg-slate-700 p-4 w-full rounded-md"
          }
        >
          <Portfolioicon />
          <span className="h-6">Portfolio</span>
        </Link>
      </div>
    </div>
  );
};
