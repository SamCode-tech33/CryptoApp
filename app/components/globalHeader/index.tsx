import { Lightningicon, Exchangeicon } from "../svgComps";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useState, useEffect } from "react";
import { addCommas, Updownarrow, Defaulticon } from "../Utility";
import axios from "axios";

export const Globalheader = () => {
  const [globalData, setGlobalData] = useState<any>({});

  const currency = useSelector(
    (state: RootState) => state.currency.currencyType
  );
  const currencySymbol = useSelector(
    (state: RootState) => state.currency.currencySymbol
  );

  const getGlobalCoinData = async () => {
    try {
      const { data } = await axios.get("/api/global");
      setGlobalData(data.data);
      //eslint-disable-next-line
    } catch (error) {}
  };

  useEffect(() => {
    getGlobalCoinData();
  }, []);

  return (
    <div className="dark:bg-slate-950 bg-gray-200">
      <div className="flex items-center mx-96 justify-around p-1 mb-2">
        <div className="flex items-center">
          <Lightningicon />
          <div>
            Coins{" "}
            {
              addCommas(Number(globalData.active_cryptocurrencies)).split(
                "."
              )[0]
            }
          </div>
        </div>
        <div className="flex items-center">
          <Exchangeicon />
          <div>
            Exhange {addCommas(Number(globalData.markets)).split(".")[0]}
          </div>
        </div>
        <div className="flex items-center">
          <Updownarrow coin={globalData.market_cap_change_percentage_24h_usd} />
          <div>
            {currencySymbol}{" "}
            {addCommas(
              Number(globalData.total_market_cap?.[currency.toLowerCase()]) /
                1000000000000
            )}{" "}
            T
          </div>
        </div>
        <div className="flex items-center">
          <div>
            {currencySymbol}{" "}
            {addCommas(
              Number(globalData.total_volume?.[currency.toLowerCase()]) /
                1000000000
            )}{" "}
            B
          </div>
          <div className="w-16 h-2 ml-3 rounded-md bg-gray-400">
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
                    : `${
                        Number(
                          globalData.total_volume?.usd /
                            globalData.total_market_cap?.usd
                        ) * 64
                      }px`,
              }}
            ></div>
          </div>
        </div>
        <div className="flex items-center">
          <Defaulticon coin="btc" height="h-6" />
          <div>
            {Math.round(Number(globalData.market_cap_percentage?.btc))}%
          </div>
          <div className="w-16 h-2 ml-3 rounded-md bg-gray-400">
            <div
              className="bg-orange-400 h-2 rounded-md"
              style={{
                width: `${Math.round(
                  (Number(globalData.market_cap_percentage?.btc) / 100) * 64
                )}px`,
              }}
            ></div>
          </div>
        </div>
        <div className="flex items-center">
          <Defaulticon coin="eth" height="h-6" />
          <div></div>
          {Math.round(Number(globalData.market_cap_percentage?.eth))}%
          <div className="w-16 h-2 ml-3 rounded-md bg-gray-400">
            <div
              className="h-2 rounded-md bg-blue-500"
              style={{
                width: `${Math.round(
                  (Number(globalData.market_cap_percentage?.eth) / 100) * 64
                )}px`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
