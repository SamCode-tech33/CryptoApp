import { Numicon, Exchangeicon } from "../svgComps";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useState, useEffect } from "react";
import { addCommas, Updownarrow, Defaulticon } from "../Utility";
import { Skeleton } from "../Skeleton";
import axios from "axios";

export const Globalheader = () => {
  const [globalData, setGlobalData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const currency = useSelector(
    (state: RootState) => state.currency.currencyType
  );
  const currencySymbol = useSelector(
    (state: RootState) => state.currency.currencySymbol
  );

  const getGlobalCoinData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/global");
      setGlobalData(data.data);
      //eslint-disable-next-line
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    getGlobalCoinData();
  }, []);

  return (
    <div className="dark:bg-slate-700 bg-gray-200">
      {error && <p>An Error has occured, please try again later</p>}
      <div className="flex items-center 2xl:mx-80 justify-around sm:p-1 xl:mx-60 lg:mx-28">
        {loading ? (
          <Skeleton classTail="h-4 w-32 dark:bg-slate-500 bg-gray-300 rounded-md" />
        ) : (
          <div className="flex items-center">
            <Numicon />
            {}
            <div className="flex items-center">
              <span className="sm:block hidden">Coins: </span>
              <span>
                {
                  addCommas(Number(globalData.active_cryptocurrencies)).split(
                    "."
                  )[0]
                }
              </span>
            </div>
          </div>
        )}
        {loading ? (
          <Skeleton classTail="h-4 w-32 dark:bg-slate-500 bg-gray-300 rounded-md" />
        ) : (
          <div className="flex items-center">
            <Exchangeicon />
            <div className="flex items-center">
              <span className="sm:block hidden">Exhange: </span>
              <span>{addCommas(Number(globalData.markets)).split(".")[0]}</span>
            </div>
          </div>
        )}
        {loading ? (
          <Skeleton classTail="h-4 w-32 dark:bg-slate-500 bg-gray-300 rounded-md" />
        ) : (
          <div className="flex items-center">
            <Updownarrow
              coin={globalData.market_cap_change_percentage_24h_usd}
            />
            <div>
              {currencySymbol}
              {addCommas(
                Number(globalData.total_market_cap?.[currency.toLowerCase()]) /
                  1000000000000
              )}{" "}
              T
            </div>
          </div>
        )}
        {loading ? (
          <Skeleton classTail="h-4 w-32 dark:bg-slate-500 bg-gray-300 rounded-md" />
        ) : (
          <div className="flex items-center">
            <div>
              {currencySymbol}
              {addCommas(
                Number(globalData.total_volume?.[currency.toLowerCase()]) /
                  1000000000
              )}{" "}
              B
            </div>
            <div className="md:w-12 h-2 ml-3 rounded-md bg-gray-400 lg:w-16 md:block hidden">
              <div
                className="bg-white h-2 rounded-md"
                style={{
                  width:
                    Number(
                      globalData.total_volume?.usd /
                        globalData.total_market_cap?.usd
                    ) *
                      64 <
                    7.5
                      ? "8px"
                      : `${Number(
                          globalData.total_volume?.usd /
                            globalData.total_market_cap?.usd
                        )}%`,
                }}
              ></div>
            </div>
          </div>
        )}
        {loading ? (
          <Skeleton classTail="h-4 w-32 dark:bg-slate-500 bg-gray-300 rounded-md" />
        ) : (
          <div className="sm:flex items-center hidden">
            <Defaulticon coin="btc" height="h-6" margin="mr-2" />
            <div>
              {Math.round(Number(globalData.market_cap_percentage?.btc))}%
            </div>
            <div className="md:w-12 h-2 ml-3 rounded-md bg-gray-400 lg:w-16">
              <div
                className="bg-orange-400 h-2 rounded-md"
                style={{
                  width: `${Math.round(
                    Number(globalData.market_cap_percentage?.btc)
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}
        {loading ? (
          <Skeleton classTail="h-4 w-32 dark:bg-slate-500 bg-gray-300 rounded-md" />
        ) : (
          <div className="items-center hidden sm:flex">
            <Defaulticon coin="eth" height="h-6" margin="mr-2" />
            <div></div>
            {Math.round(Number(globalData.market_cap_percentage?.eth))}%
            <div className="md:w-12 h-2 ml-3 rounded-md bg-gray-400 lg:w-16">
              <div
                className="h-2 rounded-md bg-blue-500"
                style={{
                  width: `${Math.round(
                    Number(globalData.market_cap_percentage?.eth)
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
