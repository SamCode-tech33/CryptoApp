"use client";

import { useEffect, useState } from "react";
import {
  Xmark,
  Uparrow,
  Arrowright,
  Sellicon,
  Trashicon,
  Bankicon,
  Plusicon,
} from "../components/svgComps";
import { addCommas, Defaulticon } from "../components/Utility";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchCoins } from "@/lib/coinsSlice";
import {
  buyAsset,
  addFunds,
  deleteAsset,
  sellAsset,
  changeCurrency,
  assetChange,
} from "@/lib/portfolioSlice";
import { Updownarrow } from "../components/Utility";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { Notification } from "../components/notifications";

export default function Portfolio() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.coins);
  const portfolio = useSelector(
    (state: RootState) => state.portfolio.portfolio
  );
  const totalFunds = useSelector(
    (state: RootState) => state.portfolio.totalFunds
  );
  const assetValue = useSelector(
    (state: RootState) => state.portfolio.assetValue
  );
  const currency = useSelector(
    (state: RootState) => state.currency.currencyType
  );
  const currencySymbol = useSelector(
    (state: RootState) => state.currency.currencySymbol
  );

  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [isCoinSelect, setIsCoinSelect] = useState(false);
  const [isPurchaseSelect, setIsPurchaseSelect] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [coinName, setCoinName] = useState("Bitcoin");
  const [coinSymbol, setCoinSymbol] = useState("BTC");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [coinPrice, setCoinPrice] = useState(0);
  const [buyWith, setBuyWith] = useState(currency);
  const [isBuyWithSelect, setIsBuyWithSelect] = useState(false);
  const [purchaseHeader, setPurchaseHeader] = useState("Purchase Amount");
  const [startDate, setStartDate] = useState(new Date());
  const [dateUnix, setDateUnix] = useState(Date.now());
  const [purchaseAmountChosen, setPurchaseAmountChosen] = useState(false);
  const [assetHeader, setAssetHeader] = useState("");
  const [noPurchase, setNoPurchase] = useState(false);
  const [purchaseNotNumber, setPurchaseNotNumber] = useState(false);
  const [isCoinAssetsSelect, setIsCoinAssetsSelect] = useState(false);
  const [assetSearchTerm, setAssetSearchTerm] = useState("");
  const [openFundsAdd, setOpenFundsAdd] = useState(false);
  const [addFundsAmount, setAddFundsAmount] = useState("");
  const [isSelling, setIsSelling] = useState(false);
  const [sellAmount, setSellAmount] = useState("");
  const [isSellWithSelect, setIsSellWithSelect] = useState(false);
  const [sellWith, setSellWith] = useState(currency);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errNoti, setErrNoti] = useState(false);
  const [noti, setNoti] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");

  const getCoinPriceOnDate = async () => {
    try {
      const { data } = await axios.get(
        `/api/specificDay?fsym=${coinSymbol}&tsym=${currency}&toTs=${dateUnix}`
      );
      const dayPrice = (data.Data.Data[1].low + data.Data.Data[1].high) / 2;
      setCoinPrice(dayPrice);
      //eslint-disable-next-line
    } catch (error) {}
  };

  const currencyChange = async () => {
    try {
      const currencyChangePortfolio = await Promise.all(
        portfolio.map(async (asset) => {
          const { data } = await axios.get(
            `/api/specificDay?fsym=${
              asset.coinSymbol
            }&tsym=${currency}&toTs=${Number(asset.dateUnix)}`
          );
          const newValue = {
            ...asset,
            currencyAmount:
              ((data.Data.Data[1].low + data.Data.Data[1].high) / 2) *
              asset.coinAmount,
          };
          return newValue;
        })
      );
      dispatch(changeCurrency(currencyChangePortfolio));
      //eslint-disable-next-line
    } catch (error) {}
  };

  const handlePurchase = () => {
    setIsPurchaseSelect(false);
    if (purchaseAmount === "") {
      return;
    } else if (!Number(purchaseAmount)) {
      setPurchaseNotNumber(true);
      setTimeout(() => setPurchaseNotNumber(false), 2000);
    } else if (purchaseAmount !== "" && buyWith === currency) {
      const coinNumber = (Number(purchaseAmount) / coinPrice)
        .toFixed(5)
        .toString();
      const purchaseHead =
        "Purchase " +
        coinNumber +
        " " +
        coinSymbol +
        " with " +
        purchaseAmount +
        " " +
        currency +
        "?";
      const assetHead = coinNumber + " " + purchaseAmount;
      setAssetHeader(assetHead);
      setPurchaseHeader(purchaseHead);
      setPurchaseAmountChosen(true);
    } else if (purchaseAmount !== "" && buyWith === coinSymbol) {
      const currencyNumber = addCommas(Number(purchaseAmount) * coinPrice);
      const purchaseHead =
        "Purchase " +
        purchaseAmount +
        " " +
        coinSymbol +
        " with " +
        currencyNumber +
        " " +
        currency +
        "?";
      const assetHead = purchaseAmount + " " + currencyNumber;
      setAssetHeader(assetHead);
      setPurchaseHeader(purchaseHead);
      setPurchaseAmountChosen(true);
    }
  };

  const handlePortfolio = (
    coinSymbol: any,
    assetHeader: any,
    dateUnix: any
  ) => {
    if (
      assetHeader !== "" &&
      Number(assetHeader.split(" ")[1].split(",").join("")) < totalFunds
    ) {
      const portfolioItem = {
        coinName: coinName,
        coinSymbol: coinSymbol,
        coinAmount: Number(assetHeader.split(" ")[0]),
        currencyAmount: Number(assetHeader.split(" ")[1].split(",").join("")),
        date: new Date(dateUnix).toString().split("GMT")[0],
        dateUnix: dateUnix,
        id: Math.random() + Math.random(),
      };
      dispatch(buyAsset(portfolioItem));
      setIsAddingAsset(false);
      setAssetHeader("");
      setPurchaseAmount("");
      setPurchaseHeader("Purchase Amount");
      setBuyWith(currency);
      setNoti(true);
      setNotiMessage("Purchase Completed");
      setTimeout(() => setNotiMessage(""), 2000);
      setTimeout(() => setNoti(false), 2000);
    } else {
      setNoPurchase(true);
      setErrNoti(true);
      setNotiMessage("Cannot Complete Purchase");
      setTimeout(() => setNotiMessage(""), 2000);
      setTimeout(() => setErrNoti(false), 2000);
      setTimeout(() => setNoPurchase(false), 2000);
    }
  };

  const handleAddFunds = () => {
    if (Number(addFundsAmount)) {
      dispatch(addFunds(addFundsAmount));
      setOpenFundsAdd(false);
      setAddFundsAmount("");
    } else {
      setOpenFundsAdd(false);
      setAddFundsAmount("");
    }
  };

  const handleSale = (
    soldAmount: any,
    soldCoinAmount: any,
    currencyAmount: any,
    coinSymbol: any,
    coinName: any,
    date: any,
    coinAmount: any,
    id: any
  ) => {
    if (Number(sellAmount) && soldAmount < currencyAmount) {
      const alteredPortfolioItem = {
        coinName: coinName,
        coinSymbol: coinSymbol,
        coinAmount: coinAmount - soldCoinAmount,
        currencyAmount: currencyAmount - soldAmount,
        date: date,
        id: id,
      };
      dispatch(sellAsset(alteredPortfolioItem));
      dispatch(addFunds(soldAmount));
      dispatch(assetChange(soldAmount));
      setIsSelling(false);
      setNoti(true);
      setNotiMessage("Sale Completed");
      setTimeout(() => setNotiMessage(""), 2000);
      setTimeout(() => setNoti(false), 2000);
    } else if (soldAmount > currencyAmount) {
      setErrNoti(true);
      setNotiMessage("Cannot Complete Sale - Selling More Than Owned");
      setTimeout(() => setNotiMessage(""), 2000);
      setTimeout(() => setErrNoti(false), 2000);
    } else {
      setErrNoti(true);
      setNotiMessage("Cannot Complete Sale - Input Number");
      setTimeout(() => setNotiMessage(""), 2000);
      setTimeout(() => setErrNoti(false), 2000);
    }
  };

  const handleDelete = (currencyAmount: any, id: any) => {
    const deleteInfo = {
      currencyAmount: currencyAmount,
      id: id,
    };
    dispatch(deleteAsset(deleteInfo));
    setIsDeleting(false);
    setNoti(true);
    setNotiMessage("Total Sale of Asset Completed");
    setTimeout(() => setNotiMessage(""), 2000);
    setTimeout(() => setNoti(false), 2000);
  };

  useEffect(() => {
    if (portfolio.length) {
      currencyChange();
    }
    dispatch(fetchCoins({ start: 1, limit: 200, convert: currency }));
    setBuyWith(currency);
  }, [currency]);

  useEffect(() => {
    getCoinPriceOnDate();
  }, [coinSymbol, dateUnix, currency]);

  useEffect(() => {
    handlePurchase();
  }, [coinPrice]);

  return (
    <div className="bg-gray-200 sm:pt-1 dark:bg-slate-900 port-height">
      <Notification
        noti={noti}
        message={errNoti ? `Error: ${notiMessage}` : `Success: ${notiMessage}`}
        error={errNoti}
      />
      <div className="sm:mb-8 sm:mt-4">
        <div className="lg:mx-32 md:mx-16 mx-4 flex justify-between items-center">
          <h1 className="lg:text-3xl md:text-2xl sm:text-xl sm:block hidden">
            Portfolio
          </h1>
          <button
            className="rounded-lg dark:bg-slate-800 lg:px-16 md:px-12 md:py-3 sm:py-2 sm:px-8 dark:hover:bg-slate-600 bg-violet-300 hover:bg-violet-400 sm:block hidden"
            onClick={() => setIsAddingAsset(!isAddingAsset)}
          >
            Add Asset
          </button>
        </div>
      </div>
      <div
        className={
          isAddingAsset
            ? "absolute dark:bg-slate-900 w-2/3 h-1/2 left-add-asset top-1/4 rounded-md border dark:border-white border-black z-10 bg-white"
            : "hidden"
        }
      >
        <div className="flex justify-between lg:mx-16 mx-4 mt-10 items-start">
          <p className="xl:text-2xl text-base">Purchase Crypto:</p>
          <p
            className={
              purchaseAmountChosen
                ? "ml-6 text-green-500 xl:text-2xl lg:text-base text-sm"
                : "hidden"
            }
          >
            {assetHeader.split(" ").join(` ${coinSymbol} - ${currencySymbol}`)}
          </p>
          <p
            className={
              noPurchase && assetHeader === ""
                ? "ml-6 text-red-500 xl:text-lg lg:text-base sm:text-sm text-xs"
                : "hidden"
            }
          >
            Choose purchase amount before continuing.
          </p>
          <p
            className={
              noPurchase && assetHeader !== ""
                ? "ml-6 text-red-500 xl:text-lg lg:text-base sm:text-sm text-xs"
                : "hidden"
            }
          >
            Not enough funds.
          </p>
          <p
            className={
              purchaseNotNumber
                ? "ml-6 text-red-500 xl:text-lg lg:text-base sm:text-sm text-xs"
                : "hidden"
            }
          >
            Amount must be a number and greater than 0.
          </p>
          <button
            className="2xl:p-1 border border-white rounded-full hover:text-black hover:bg-white sm:block hidden"
            onClick={() => setIsAddingAsset(false)}
          >
            <Xmark />
          </button>
        </div>
        <div className="flex justify-between lg:mx-16 mx-4 lg:items-center mt-8 items-start">
          <div className="dark:bg-slate-800  bg-violet-300 md:w-1/4 w-1/3 rounded-md flex flex-col items-center justify-around xl:py-12 sm:py-8 py-6">
            <div className="mb-4">
              <Defaulticon
                coin={coinSymbol}
                height="2xl:h-10 xl:h-8 lg:h-6 h-4"
                margin="mr-0"
              />
            </div>
            <div className="flex flex-col items-center">
              <div className="2xl:text-xl xl:text-base lg:text-sm text-xs sm:block hidden">
                {coinName}
              </div>
              <div className="2xl:text-xl xl:text-base lg:text-sm text-xs">
                {coinSymbol}
              </div>
            </div>
          </div>
          <div className="h-3/5 w-3/5 rounded-md">
            <div className="w-full h-full flex items-center sm:justify-between justify-center dark:bg-slate-800 p-2 rounded-md bg-violet-300 relative">
              <div className="flex items-center">
                <Defaulticon
                  coin={coinSymbol}
                  height="xl:h-8 lg:h-6 h-4"
                  margin="mr-2"
                />
                <span className="ml-2 xl:text-base lg:text-sm text-xs sm:block hidden">
                  {coinName} ({coinSymbol})
                </span>
                <span className="ml-2 xl:text-base lg:text-sm text-xs sm:hidden block">
                  {coinSymbol}
                </span>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsCoinSelect(true)}
                onBlur={() => setTimeout(() => setIsCoinSelect(false), 200)}
                id="searchBar"
                className="w-1/2 pl-10 pr-4 p-2 rounded-sm dark:bg-slate-600 dark:text-white dark:caret-white"
              />
              <div
                className={
                  isCoinSelect
                    ? "border absolute z-10 dark:bg-slate-900 overflow-y-scroll max-h-96 bg-slate-300 left-1/2 top-full w-1/2"
                    : "hidden"
                }
              >
                {data.length &&
                  data
                    .filter((coin) =>
                      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((coin) => {
                      return (
                        <div
                          key={coin.symbol + Math.random() * 1}
                          className="p-3 dark:hover:bg-slate-600 cursor-pointer flex justify-between hover:bg-slate-400 md:flex-row flex-col sm:text-base text-sm"
                          onClick={() => {
                            setCoinSymbol(coin.symbol);
                            setCoinName(coin.name);
                            setIsCoinSelect(false);
                          }}
                        >
                          <div className="flex items-center">
                            <Defaulticon
                              coin={coin.symbol}
                              height="lg:h-6 h-4"
                              margin="mr-2"
                            />
                            <span className="hidden lg:block">
                              {coin.name} ({coin.symbol})
                            </span>
                            <span className="block lg:hidden">
                              {coin.name.split(" ")[0]}
                            </span>
                          </div>
                          <span>
                            {currencySymbol}
                            {addCommas(coinPrice)}
                          </span>
                        </div>
                      );
                    })}
              </div>
            </div>
            <button
              className="w-full h-full flex items-center sm:justify-between justify-center dark:bg-slate-800 p-2 rounded-md dark:hover:bg-slate-600 mt-4 bg-violet-300 hover:bg-violet-400"
              onClick={() => {
                setIsPurchaseSelect(!isPurchaseSelect);
                setIsCoinSelect(false);
              }}
            >
              <span className="ml-2 xl:text-base lg:text-sm text-xs md:block hidden">
                {purchaseHeader}
              </span>
              {assetHeader ? (
                <span className="ml-2 xl:text-base lg:text-sm text-xs md:hidden block">
                  {assetHeader.split(" ")[0] + " " + coinSymbol}
                </span>
              ) : (
                <span className="ml-2 xl:text-base lg:text-sm text-xs md:hidden block">
                  Amount
                </span>
              )}
              <Uparrow isOpen={isPurchaseSelect} />
            </button>
            <div
              className={
                isPurchaseSelect && coinSymbol !== ""
                  ? "border absolute z-10 dark:bg-slate-900 md:h-32 h-64 w-full flex flex-col justify-around bg-slate-300"
                  : "hidden"
              }
            >
              <div className="flex md:items-center items-start justify-between md:flex-row flex-col ml-4">
                <input
                  type="text"
                  value={purchaseAmount}
                  placeholder="Purchase Amount. . ."
                  className="w-1/2 p-2 rounded-sm dark:bg-slate-700 dark:text-white dark:caret-white text-left md:block hidden"
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                />
                <input
                  type="text"
                  value={purchaseAmount}
                  placeholder="#. . ."
                  className="w-2/3 p-2 rounded-sm dark:bg-slate-700 dark:text-white dark:caret-white text-left block md:hidden"
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                />
                <div
                  className="sm:w-20 w-2/3 flex items-center justify-between dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md p-2 bg-white hover:bg-violet-300 mt-4 md:mt-0 relative cursor-pointer"
                  onClick={() => setIsBuyWithSelect(!isBuyWithSelect)}
                >
                  <span>{buyWith}</span> <Uparrow isOpen={isBuyWithSelect} />
                  <div
                    className={
                      isBuyWithSelect
                        ? "absolute z-10 dark:bg-slate-800 flex flex-col w-full bg-white buy-with-abs rounded-md"
                        : "hidden"
                    }
                  >
                    <button
                      className="p-2 dark:hover:bg-slate-600 hover:bg-violet-300 rounded-md"
                      onClick={() => {
                        setBuyWith(currency);
                        setIsBuyWithSelect(false);
                      }}
                    >
                      {currency}
                    </button>
                    <button
                      className=" p-2 dark:hover:bg-slate-600 hover:bg-violet-300 rounded-md"
                      onClick={() => {
                        setBuyWith(coinSymbol);
                        setIsBuyWithSelect(false);
                      }}
                    >
                      {coinSymbol}
                    </button>
                  </div>
                </div>
                <button
                  className="sm:w-16 w-2/3 dark:bg-slate-700 p-2 rounded-lg mr-4 dark:hover:bg-slate-500 bg-white hover:bg-violet-300 mt-4 md:mt-0 flex justify-center"
                  onClick={() => handlePurchase()}
                >
                  <Arrowright />
                </button>
              </div>
              <div className="flex items-center mx-6 justify-between md:flex-row flex-col sm:text-base text-xs">
                {buyWith === currency ? (
                  <div className="flex">
                    <span className="mr-1">{currency}: </span>
                    <span>
                      {currencySymbol}
                      {addCommas(Number(purchaseAmount))}
                    </span>
                  </div>
                ) : (
                  <div className="flex">
                    <span className="mr-1">{coinSymbol}: </span>
                    <span>{purchaseAmount}</span>
                  </div>
                )}
                {buyWith === currency ? (
                  <div className="flex">
                    <span className="mr-1">{coinSymbol}: </span>
                    <span>
                      {(Number(purchaseAmount) / coinPrice).toFixed(6)}
                    </span>
                  </div>
                ) : (
                  <div className="flex">
                    <span className="mr-1">{currency}: </span>
                    <span>
                      {currencySymbol}
                      {addCommas(Number(purchaseAmount) * coinPrice)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center sm:justify-between justify-center dark:bg-slate-800 p-2 rounded-md mt-4 bg-violet-300 hover:bg-violet-400">
              <span className="ml-2 xl:text-base lg:text-sm text-xs sm:block hidden">
                Purchase Date
              </span>
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(date: any) => setStartDate(date)}
                  maxDate={new Date()}
                  className="date-cal dark:bg-slate-600"
                  onSelect={(date: any) => {
                    setDateUnix(
                      Math.floor(
                        new Date(
                          new Date(date).setUTCHours(23, 59, 59, 999)
                        ).getTime() / 1000
                      )
                    );
                  }}
                />
              </div>
            </div>
            <div className="flex sm:justify-between justify-center sm:flex-row flex-col">
              <button
                className="dark:bg-teal-800 lg:p-3 sm:p-2 p-1 mt-4 sm:w-56 rounded-md dark:hover:bg-teal-600 bg-teal-400 hover:bg-teal-500 xl:text-sm text-xs sm:hidden block"
                onClick={() =>
                  handlePortfolio(coinSymbol, assetHeader, dateUnix)
                }
              >
                Save & Buy
              </button>
              <button
                className="dark:bg-slate-800 lg:p-3 sm:p-2 p-1 mt-4 sm:w-56 rounded-md dark:hover:bg-slate-600 bg-violet-300 hover:bg-violet-400 xl:text-sm text-xs"
                onClick={() => setIsAddingAsset(false)}
              >
                Cancel
              </button>
              <button
                className="dark:bg-teal-800 lg:p-3 sm:p-2 mt-4 p-1 sm:w-56 rounded-md dark:hover:bg-teal-600 bg-teal-400 hover:bg-teal-500 xl:text-sm text-xs hidden sm:block"
                onClick={() =>
                  handlePortfolio(coinSymbol, assetHeader, dateUnix)
                }
              >
                Save and Continue
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="dark:bg-slate-800 rounded-lg mb-4 flex justify-between p-5 lg:mx-32 md:mx-16 mx-4 items-center bg-white relative">
        <div className=" dark:bg-slate-600 rounded-md lg:flex flex-col items-center bg-violet-200 mr-4 w-72 hidden">
          <div className="my-4">
            <Bankicon />
          </div>
          <span className="text-xl mb-4">Bank</span>
        </div>
        <div className=" absolute lg:hidden bank-abs">
          <Bankicon />
        </div>
        <div className="flex lg:flex-row justify-between flex-col-reverse w-full items-center">
          <div className="flex w-full justify-between lg:mt-0 mt-4">
            <div className="flex flex-col items-center dark:bg-slate-700 bg-violet-200 rounded-md mr-4 w-1/2 p-2 md:text-sm text-xs">
              <span className="md:underline opacity-50 md:opacity-100 my-2">
                Bank Funds
              </span>
              <span>
                {currencySymbol}
                {addCommas(totalFunds)}
              </span>
            </div>
            <div className="flex flex-col items-center dark:bg-slate-700 bg-violet-200 rounded-md mr-4 w-1/2 p-2 md:text-sm text-xs">
              <span className="md:underline opacity-50 md:opacity-100 my-2">
                Crypto-Asset Value
              </span>
              <span>
                {currencySymbol}
                {addCommas(assetValue)}
              </span>
            </div>
            <div className="flex flex-col items-center dark:bg-slate-700 bg-violet-200 rounded-md mr-4 w-1/2 p-2 md:text-sm text-xs">
              <span className="md:underline opacity-50 md:opacity-100 my-2">
                Total Wealth
              </span>
              <span>
                {currencySymbol}
                {addCommas(totalFunds + assetValue)}
              </span>
            </div>
          </div>
          <div className="lg:w-2/3 flex lg:justify-end w-full lg:text-base text-xs mx-4">
            <div>
              <div
                className="w-full lg:w-full flex items-center justify-between dark:bg-slate-600 py-4 px-2 sm:px-4 rounded-md cursor-pointer dark:hover:bg-slate-400 bg-violet-300 hover:bg-violet-400"
                onClick={() => {
                  setIsCoinAssetsSelect(!isCoinAssetsSelect);
                }}
              >
                <div className="flex">
                  <span>Coins Owned</span>
                </div>
                <Uparrow isOpen={isCoinAssetsSelect} />
              </div>
              {isCoinAssetsSelect && (
                <div className="border absolute z-10 dark:bg-slate-900 overflow-y-scroll h-80 border-black dark:border-white bg-slate-300">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setAssetSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 p-2 rounded-sm dark:bg-slate-600 text-white dark:caret-white border-black border"
                  />
                  {portfolio.length &&
                    portfolio
                      .filter((asset) =>
                        asset.coinName
                          .toLowerCase()
                          .includes(assetSearchTerm.toLowerCase())
                      )
                      .map((asset) => {
                        return (
                          <div
                            key={asset.date + asset.coinSymbol}
                            className="p-3 dark:hover:bg-slate-600 cursor-pointer flex justify-between hover:bg-slate-400 lg:flex-row flex-col"
                          >
                            <div className="flex items-center">
                              <Defaulticon
                                coin={asset.coinSymbol}
                                height="h-4"
                                margin="mr-2"
                              />
                              <span>
                                {asset.coinSymbol} - {asset.coinAmount}
                              </span>
                            </div>
                            <span className="ml-6">
                              {currencySymbol}
                              {addCommas(asset.currencyAmount)}
                            </span>
                          </div>
                        );
                      })}
                </div>
              )}
            </div>
            <div>
              {!openFundsAdd ? (
                <button
                  className="flex sm:w-full w-2/3 mx-4 justify-between items-center dark:bg-slate-600 dark:hover:bg-slate-400 sm:p-4 p-2 rounded-md bg-violet-300 hover:bg-violet-400"
                  onClick={() => setOpenFundsAdd(true)}
                >
                  <span>Add Funds</span>
                  <Sellicon />
                </button>
              ) : (
                <div className="p-4 dark:bg-slate-900 flex w-64 rounded-md bg-slate-300 relative z-10">
                  <input
                    type="text"
                    placeholder="Add Funds..."
                    value={addFundsAmount}
                    onChange={(e) => setAddFundsAmount(e.target.value)}
                    className="w-full p-2 rounded-sm dark:bg-slate-600 dark:text-white dark:caret-white"
                  />
                  <button
                    onClick={handleAddFunds}
                    className="p-2 ml-3 rounded-md dark:bg-slate-600"
                  >
                    <Arrowright />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:mx-32 md:mx-16 mx-4">
        {loading && <div className="loading"></div>}
        {data.length &&
          portfolio.map((asset) => {
            const coin = data.find((coin) => coin.name === asset.coinName);
            const coinQuote = coin.quote?.[currency];
            if (!coin || !coinQuote) return null;
            const capToVol = (
              (coinQuote.volume_24h / coinQuote.market_cap) *
              100
            ).toFixed(1);
            const circToMax = coin.circulating_supply / coin.max_supply;
            const priceChange24 =
              (coinQuote.percent_change_24h / 100) * coinQuote.price;
            let coinMax = coin.max_supply;
            if (coin.max_supply === null) {
              coinMax = "∞";
            }
            return (
              <div
                className="dark:bg-slate-800 rounded-lg mb-6 flex justify-between p-5 relative bg-white"
                key={asset.coinSymbol}
              >
                <div className=" dark:bg-slate-700 w-72 rounded-md flex-col items-center justify-center bg-violet-200 hidden lg:flex">
                  <div className="mb-16">
                    <Defaulticon
                      coin={asset.coinSymbol}
                      height="h-16"
                      margin="mr-0"
                    />
                  </div>
                  <span className="xl:text-3xl mt-4">
                    {asset.coinName} {asset.coinSymbol}
                  </span>
                </div>
                <div className="lg:hidden absolute left-emblem">
                  <Defaulticon
                    coin={asset.coinSymbol}
                    height="h-10"
                    margin="mr-0"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex flex-col mx-0 lg:mx-4 border-b-2 border-gray-400 pb-6 2xl:text-base text-sm w-full">
                    <div className="flex justify-between mb-4">
                      <div className="text-2xl md:block hidden">
                        <div>Market Price</div>
                        <div className="text-xs">Purchased {asset.date}</div>
                      </div>
                      <div className="text-xs block md:hidden">
                        <div>
                          {asset.coinName} ({asset.coinSymbol})
                        </div>
                        <div className="opacity-50">Purchased</div>
                        <div className="opacity-50">{asset.date}</div>
                      </div>
                      <div className="mr-12 sm:mr-20 lg:mr-5">
                        {isSelling && (
                          <div className="absolute z-10 dark:bg-slate-900 p-3 rounded-md left-1/2 top-1/3 flex flex-col items-center bg-slate-300">
                            <span>Amount to sell?</span>
                            <div className="flex items-center my-4">
                              <input
                                type="text"
                                value={sellAmount}
                                placeholder="Sale Amount. . ."
                                className="w-2/3 p-2 rounded-sm dark:bg-slate-700 dark:text-white dark:caret-white ml-4 text-left bg-white"
                                onChange={(e) => setSellAmount(e.target.value)}
                              />
                              <button
                                className="flex items-center dark:bg-slate-700 rounded-md p-2 mx-4 dark:hover:bg-slate-400 bg-white hover:bg-violet-300"
                                onClick={() =>
                                  setIsSellWithSelect(!isSellWithSelect)
                                }
                              >
                                <span>{sellWith}</span>{" "}
                                <Uparrow isOpen={isSellWithSelect} />
                              </button>
                              <div className="relative">
                                <div
                                  className={
                                    isSellWithSelect
                                      ? "absolute z-10 dark:bg-slate-600 top-5 -left-22 flex flex-col bg-white"
                                      : "hidden"
                                  }
                                >
                                  <button
                                    className="py-2 px-4 dark:hover:bg-slate-400 hover:bg-violet-300"
                                    onClick={() => {
                                      setSellWith(currency);
                                      setIsSellWithSelect(false);
                                    }}
                                  >
                                    {currency}
                                  </button>
                                  <button
                                    className=" py-2 px-4 dark:hover:bg-slate-400 hover:bg-violet-300"
                                    onClick={() => {
                                      setSellWith(coinSymbol);
                                      setIsSellWithSelect(false);
                                    }}
                                  >
                                    {coinSymbol}
                                  </button>
                                </div>
                              </div>
                              <button
                                className="p-3 rounded-md dark:bg-slate-600 bg-white dark:hover:bg-slate-400 hover:bg-violet-300"
                                onClick={() => {
                                  let soldAmount;
                                  let soldCoinAmount;
                                  if (sellWith === currency) {
                                    soldAmount = sellAmount;
                                    soldCoinAmount =
                                      (Number(sellAmount) / coinPrice) *
                                      asset.coinAmount;
                                  } else {
                                    soldAmount = Number(sellAmount) * coinPrice;
                                    soldCoinAmount = sellAmount;
                                  }
                                  handleSale(
                                    soldAmount,
                                    soldCoinAmount,
                                    asset.currencyAmount,
                                    asset.coinSymbol,
                                    asset.coinName,
                                    asset.date,
                                    asset.coinAmount,
                                    asset.id
                                  );
                                }}
                              >
                                <Arrowright />
                              </button>
                            </div>
                            <div className="flex items-center mx-6">
                              {sellWith === currency ? (
                                <div className="flex mr-4">
                                  <span className="mr-1">{currency}: </span>
                                  <span>
                                    {currencySymbol}{" "}
                                    {addCommas(Number(sellAmount))}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex mr-4">
                                  <span className="mr-1">{coinSymbol}: </span>
                                  <span>{addCommas(Number(sellAmount))}</span>
                                </div>
                              )}
                              {sellWith === currency ? (
                                <div className="flex ml-4">
                                  <span className="mr-1">{coinSymbol}: </span>
                                  <span>
                                    {(Number(sellAmount) / coinPrice).toFixed(
                                      6
                                    )}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex ml-4">
                                  <span className="mr-1">{currency}: </span>
                                  <span>
                                    {currencySymbol}{" "}
                                    {addCommas(Number(sellAmount) * coinPrice)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {isDeleting && (
                          <div className="absolute z-10 dark:bg-slate-900 p-4 rounded-md flex flex-col items-center left-1/2 top-1/3 bg-slate-300">
                            <span>
                              By deleting this, you agree to sell the entire
                              asset
                            </span>
                            <div className="flex w-full justify-around">
                              <button
                                className="p-3 dark:bg-slate-600 dark:hover:bg-slate-400 my-4 rounded-lg bg-violet-300 hover:bg-violet-400"
                                onClick={() =>
                                  handleDelete(asset.currencyAmount, asset.id)
                                }
                              >
                                Delete & Sell
                              </button>
                              <button
                                className="p-3 dark:bg-slate-600 dark:hover:bg-slate-400 my-4 rounded-lg bg-violet-300 hover:bg-violet-400"
                                onClick={() => setIsDeleting(false)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                        <button
                          className="p-2 dark:bg-slate-600 rounded-md dark:hover:bg-slate-400 lg:mr-2 mr-0.5 bg-violet-300 hover:bg-violet-400"
                          onClick={() => setIsSelling(!isSelling)}
                        >
                          <Sellicon />
                        </button>
                        <button
                          className="p-2 dark:bg-slate-600 rounded-md dark:hover:bg-slate-400 lg:ml-2 ml-0.5 bg-violet-300 hover:bg-violet-400"
                          onClick={() => setIsDeleting(!isDeleting)}
                        >
                          <Trashicon />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="xl:flex-row flex flex-col mr-4 h-full w-full">
                        <div className="flex flex-col items-center justify-center dark:bg-slate-700 bg-violet-200 p-2 rounded-md w-full xl:mb-0 mb-4 xl:mr-4 h-full">
                          <span className="md:underline md:text-sm text-xs opacity-50 md:opacity-100 mb-2">
                            Current Price
                          </span>
                          <span>
                            {currencySymbol}
                            {addCommas(coinQuote.price)}
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center dark:bg-slate-700 bg-violet-200 p-2 rounded-md w-full h-full">
                          <span className="md:underline md:text-sm text-xs opacity-50 md:opacity-100 mb-2">
                            Price Change 24h
                          </span>
                          <div className="flex items-center">
                            <Updownarrow coin={priceChange24} />
                            <span
                              className={
                                priceChange24 >= 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {currencySymbol}
                              {addCommas(Math.abs(priceChange24))}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="xl:flex-row flex flex-col w-full mr-4">
                        <div className="flex flex-col items-center justify-center dark:bg-slate-700 bg-violet-200 p-2 rounded-md w-full xl:mr-4">
                          <span className="md:underline md:text-sm text-xs opacity-50 md:opacity-100">
                            Volume - Market Cap
                          </span>
                          <div className="flex items-center lg:flex-col flex-row">
                            <div className="mt-2 md:block hidden">
                              <div className="bg-gray-400 lg:w-40 w-20 h-2 lg:h-3 rounded-lg">
                                <div
                                  className={
                                    Number(capToVol) > 4
                                      ? "bg-green-500 h-2 lg:h-3 rounded-lg"
                                      : "bg-red-500 h-2 lg:h-3 rounded-lg"
                                  }
                                  style={{
                                    width:
                                      Number(capToVol) > 8
                                        ? `${capToVol}%`
                                        : "8%",
                                  }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-green-500 ml-2 lg:ml-0 mt-2">
                              {capToVol}%
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center dark:bg-slate-700 bg-violet-200 p-2 rounded-md w-full xl:mt-0 mt-4">
                          <span className="underline md:block hidden">
                            Circ Supply - Max Supply
                          </span>
                          <span className="md:text-sm text-xs opacity-50 md:opacity-100 md:hidden block">
                            Circulating - Max
                          </span>
                          <div className="flex items-center lg:flex-col flex-row">
                            <div className="mt-2 md:block hidden">
                              <div className="bg-gray-400 lg:w-40 w-20 h-2 lg:h-3 rounded-lg">
                                <div
                                  className="dark:bg-teal-400 bg-teal-500 h-2 lg:h-3 rounded-lg"
                                  style={{
                                    width:
                                      Number(circToMax * 100) > 8
                                        ? `${circToMax * 100}%`
                                        : "8%",
                                  }}
                                ></div>
                              </div>
                            </div>
                            <span className="dark:text-teal-400 text-teal-500 ml-2 lg:ml-0 mt-2 lg:block hidden">
                              {addCommas(coin.circulating_supply).split(".")[0]}{" "}
                              / {addCommas(coin.max_supply).split(".")[0]}
                            </span>
                            {coinMax === "∞" ? (
                              <span className="dark:text-teal-400 text-teal-500 ml-2 lg:ml-0 mt-2 block lg:hidden">
                                {
                                  addCommas(
                                    coin.circulating_supply / 1000000
                                  ).split(".")[0]
                                }
                                M / ∞
                              </span>
                            ) : (
                              <span className="dark:text-teal-400 text-teal-500 ml-2 lg:ml-0 mt-2 block lg:hidden">
                                {
                                  addCommas(
                                    coin.circulating_supply / 1000000
                                  ).split(".")[0]
                                }
                                M /{" "}
                                {
                                  addCommas(coin.max_supply / 1000000).split(
                                    "."
                                  )[0]
                                }{" "}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col lg:ml-4 pt-6 2xl:text-base text-sm w-full">
                    <div className="justify-between mb-4 md:flex hidden">
                      <h1 className="text-2xl">Your Holdings</h1>
                    </div>
                    <div className="flex justify-between w-full">
                      <div className="flex w-full xl:flex-row flex-col mr-4">
                        <div className="flex flex-col items-center dark:bg-slate-700 bg-violet-200 p-2 rounded-md w-full h-full mr-4 mb-4">
                          <span className="md:text-sm text-xs opacity-50 md:opacity-100 mb-2 md:underline">
                            Coins Held
                          </span>
                          <span>{asset.coinAmount.toFixed(5)}</span>
                        </div>
                        <div className="flex flex-col items-center dark:bg-slate-700 bg-violet-200 p-2 rounded-md w-full h-full">
                          <span className="md:text-sm text-xs opacity-50 md:opacity-100 mb-2 md:underline">
                            Value at Purchase
                          </span>
                          <div className="flex items-center">
                            <span>
                              {currencySymbol}
                              {addCommas(asset.currencyAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full xl:flex-row flex-col mr-4">
                        <div className="flex flex-col items-center dark:bg-slate-700 bg-violet-200 p-2 rounded-md w-full h-full mr-4 mb-4">
                          <span className="md:text-sm text-xs opacity-50 md:opacity-100 mb-2 md:underline">
                            Current Fiat Value
                          </span>
                          <span
                            className={
                              Number(coinQuote.price) *
                                Number(asset.coinAmount) >
                              Number(asset.currencyAmount)
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            {currencySymbol}
                            {addCommas(coinQuote.price * asset.coinAmount)}
                          </span>
                        </div>
                        <div className="flex flex-col items-center dark:bg-slate-700 bg-violet-200 sm:p-2 p-1 rounded-md w-full h-full">
                          <span className="md:text-sm text-xs opacity-50 md:opacity-100 sm:mb-2 md:underline">
                            Value Change
                          </span>
                          <div className="flex items-center sm:flex-row flex-col">
                            <div className="flex items-center">
                              <Updownarrow
                                coin={
                                  Number(coinQuote.price) *
                                    Number(asset.coinAmount) -
                                  Number(asset.currencyAmount)
                                }
                              />
                              <span
                                className={
                                  Number(coinQuote.price) *
                                    Number(asset.coinAmount) >
                                  Number(asset.currencyAmount)
                                    ? "text-green-500 sm:mr-3"
                                    : "text-red-500 sm:mr-3"
                                }
                              >
                                {" "}
                                {currencySymbol}
                                {addCommas(
                                  Math.abs(
                                    Number(coinQuote.price) *
                                      Number(asset.coinAmount) -
                                      Number(asset.currencyAmount)
                                  )
                                )}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Updownarrow
                                coin={
                                  Number(coinQuote.price) *
                                    Number(asset.coinAmount) -
                                  Number(asset.currencyAmount)
                                }
                              />
                              <span
                                className={
                                  Number(coinQuote.price) *
                                    Number(asset.coinAmount) >
                                  Number(asset.currencyAmount)
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                {(
                                  (Math.abs(
                                    Number(coinQuote.price) *
                                      Number(asset.coinAmount) -
                                      Number(asset.currencyAmount)
                                  ) /
                                    Number(asset.currencyAmount)) *
                                  100
                                ).toFixed(3)}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <button
        className="rounded-3xl dark:bg-violet-800 lg:px-16 md:px-12 p-3 dark:hover:bg-violet-600 bg-violet-200 hover:bg-violet-400 sm:hidden sticky-add border border-slate-500"
        onClick={() => setIsAddingAsset(!isAddingAsset)}
      >
        <Plusicon />
      </button>
    </div>
  );
}
