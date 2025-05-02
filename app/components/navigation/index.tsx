import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchCoins } from "@/lib/coinsSlice";
import { changeSearch } from "@/lib/searchSlice";
import { addCommas, Defaulticon } from "../Utility";
import { Currency } from "../Currency";
import { ModeToggle } from "../themeselector";
import { Logo } from "../svgComps";

const Navlinks = () => {
  return (
    <div className="flex justify-between items-center lg:px-36 md:px-16 sm:px-8 px-3 bg-white py-4 dark:bg-slate-900">
      <Link href="/">
        <div className="flex h-4 items-center">
          <Logo />
          <h3 className="hidden md:block md:ml-2">ZenCoin</h3>
        </div>
      </Link>
      <div className="flex justify-between items-center">
        <Link href="/" className="xl:mx-6 flex items-center sm:mx-2 mx-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={
              location.pathname === "/coins"
                ? "h-6 sm:mr-2 dark:text-white text-violet-700"
                : "dark:text-slate-600 h-6 sm:mr-2 text-violet-300"
            }
          >
            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
          </svg>

          <span
            className={
              location.pathname === "/coins"
                ? "dark:text-white text-violet-700 hidden md:block"
                : "dark:text-slate-600 text-violet-300 hidden md:block"
            }
          >
            Home
          </span>
        </Link>
        <Link href="/portfolio" className="xl:mx-6 flex sm:mx-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={
              location.pathname === "/portfolio"
                ? "h-6 mr-2 dark:text-white text-violet-700"
                : "h-6 mr-2 dark:text-slate-600 text-violet-300"
            }
          >
            <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
            <path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" />
            <path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z" />
          </svg>

          <span
            className={
              location.pathname === "/portfolio"
                ? "dark:text-white text-violet-700 hidden md:block"
                : "dark:text-slate-600 text-violet-300 hidden md:block"
            }
          >
            Portfolio
          </span>
        </Link>
      </div>
      <Navsearch />
      <div className="flex items-center">
        <Currency />
        <ModeToggle />
      </div>
    </div>
  );
};

const Navsearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  const currency = useSelector(
    (state: RootState) => state.currency.currencyType
  );
  const currencySymbol = useSelector(
    (state: RootState) => state.currency.currencySymbol
  );

  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.coins
  );

  const handleInputChange = (e: any) => {
    dispatch(changeSearch(e.target.value));
  };

  useEffect(() => {
    if (!data)
      dispatch(fetchCoins({ start: 1, limit: 100, convert: currency }));
  }, [currency]);

  return (
    <div className="relative xl:w-80 lg:w-52 w-40">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full pl-9 pr-4 p-2 rounded-sm dark:bg-slate-800 text-white dark:caret-white bg-slate-300"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400"
      >
        <path
          fillRule="evenodd"
          d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
          clipRule="evenodd"
        />
      </svg>
      {error ? (
        <p className="text-red-600">
          An error has occured, please try again later...
        </p>
      ) : (
        <div
          className={
            isOpen
              ? "border absolute z-10 dark:bg-slate-900 w-full overflow-y-scroll h-96 bg-slate-300"
              : "hidden"
          }
        >
          {loading && <div className="loading"></div>}
          {data
            .filter((coin) =>
              coin.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((coin) => {
              if (!coin.quote?.[currency]) {
                return null;
              }
              let coinQuote;
              if (coin.quote?.[currency]) {
                coinQuote = coin.quote?.[currency];
              } else {
                coinQuote = coin.quote.USD;
              }
              const coinPrice = addCommas(coinQuote.price);
              return (
                <Link
                  href={`/coins/${coin.id}`}
                  key={coin.id}
                  className="p-2 hover:bg-slate-400 dark:hover:bg-gray-700 rounded flex justify-between sm:flex-row flex-col"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <Defaulticon
                      coin={coin.symbol}
                      height="h-4"
                      margin="mr-2"
                    />
                    <span className="hidden sm:block">
                      {coin.name} ({coin.symbol})
                    </span>
                    <span className="sm:hidden block">
                      {coin.name.split(" ")[0]}
                    </span>
                  </div>
                  <span>
                    {currencySymbol} {coinPrice}
                  </span>
                </Link>
              );
            })}
          {data.filter((coin) =>
            coin.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).length === 0 &&
            !loading && <p className="block p-2">No coin found...</p>}
        </div>
      )}
    </div>
  );
};

export default Navlinks;
