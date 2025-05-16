import Link from "next/link";
import { Homeicon, Rightleftarrows, Portfolioicon } from "../svgComps";
import { usePathname } from "next/navigation";

export const Stickynav = () => {
  const pathname = usePathname();
  const baseClasses =
    "xl:mx-6 flex flex-col items-center sm:mx-2 mx-1 cursor-pointer p-4 w-full rounded-md";
  const activeClasses = "dark:bg-slate-700 bg-white";
  const inactiveClasses = "dark:hover:bg-slate-700 hover:bg-white";

  return (
    <div className="sticky-nav dark:bg-slate-900 bg-slate-300 px-3 py-1 sm:hidden">
      <div className="flex justify-between items-center sm:hidden">
        <Link
          href="/"
          className={`${baseClasses} ${
            pathname === "/" || pathname === "/coins"
              ? activeClasses
              : inactiveClasses
          }`}
        >
          <Homeicon />
          <span>Home</span>
        </Link>
        <Link
          href="/convertor"
          className={`${baseClasses} ${
            pathname === "/convertor" ? activeClasses : inactiveClasses
          }`}
        >
          <Rightleftarrows />
          <span>Convertor</span>
        </Link>
        <Link
          href="/portfolio"
          className={`${baseClasses} ${
            pathname === "/portfolio" ? activeClasses : inactiveClasses
          }`}
        >
          <Portfolioicon />
          <span className="h-6">Portfolio</span>
        </Link>
      </div>
    </div>
  );
};
