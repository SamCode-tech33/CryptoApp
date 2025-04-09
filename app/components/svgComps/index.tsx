import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchCoins } from "@/lib/coinsSlice";
import { changeSearch } from "@/lib/searchSlice";
import { addCommas } from "../Utility";

export const Navlinks = () => {
  const [home, setHome] = useState(true);

  const changeHome = () => {
    setHome(false);
  };
  const backHome = () => {
    setHome(true);
  };
  return (
    <div className="flex justify-between items-center">
      <Link href="/" className="mx-6 flex items-center" onClick={backHome}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={home ? "h-6 mr-2" : "text-slate-600 h-6 mr-2"}
        >
          <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
          <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
        </svg>

        <span className={home ? "" : "text-slate-600"}>Home</span>
      </Link>
      <Link href="/portfolio" className="mx-6 flex" onClick={changeHome}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={home ? "h-6 mr-2 text-slate-600" : "h-6 mr-2"}
        >
          <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
          <path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" />
          <path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z" />
        </svg>

        <span className={home ? "text-slate-600" : ""}>Portfolio</span>
      </Link>
    </div>
  );
};

export const Navsearch = () => {
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
      dispatch(fetchCoins({ start: 1, limit: 400, convert: currency }));
  }, [currency]);

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full pl-10 pr-4 p-2 rounded-sm bg-slate-800 text-white dark:caret-white"
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
        <p className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          An error has occured, please try again later...
        </p>
      ) : (
        <div
          className={
            isOpen
              ? "border absolute z-10 bg-slate-900 w-full overflow-y-scroll h-96"
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
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex justify-between"
                  onClick={() => setIsOpen(false)}
                >
                  <span>
                    {coin.name} ({coin.symbol})
                  </span>
                  <span>
                    {currencySymbol} {coinPrice}
                  </span>
                </Link>
              );
            })}
          {data.filter((coin) =>
            coin.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).length === 0 &&
            !loading && (
              <p className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                No coin found...
              </p>
            )}
        </div>
      )}
    </div>
  );
};

export const Filtericon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-5 ml-1"
    >
      <path d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
    </svg>
  );
};

export const Arrowright = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5"
    >
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const Xmark = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
};

export const Comparegraph = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="mr-4 h-5 mb-1"
    >
      <path d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
};

export const Compexit = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="mr-4 h-6"
    >
      <path d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
    </svg>
  );
};

export const Uparrow = ({ isOpen }: any) => {
  return (
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
  );
};

export const Lightningicon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-4 mr-2"
    >
      <path d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  );
};

export const Exchangeicon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-4 mr-2"
    >
      <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  );
};
