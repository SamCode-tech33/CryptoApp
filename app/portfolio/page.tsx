"use client";
import { useEffect, useState } from "react";
import {
  Xmark,
  Uparrow,
  Arrowright,
  Sellicon,
  Trashicon,
  Bankicon,
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
} from "@/lib/portfolioSlice";
import { Updownarrow } from "../components/Utility";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

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

  const handlePurchase = () => {
    setIsPurchaseSelect(false);
    if (!Number(purchaseAmount)) {
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
        currencyAmount: assetHeader.split(" ")[1],
        date: new Date(dateUnix).toString().split("GMT")[0],
        id: Math.random() + Math.random(),
      };
      dispatch(buyAsset(portfolioItem));
      setIsAddingAsset(false);
      setAssetHeader("");
      setPurchaseAmount("");
      setPurchaseHeader("Purchase Amount");
      setBuyWith(currency);
    } else {
      setNoPurchase(true);
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
        currencyAmount: addCommas(
          Number(currencyAmount.split(",").join("")) - Number(soldAmount)
        ),
        date: date,
        id: id,
      };
      dispatch(sellAsset(alteredPortfolioItem));
      dispatch(addFunds(soldAmount));
    }
    setIsSelling(false);
  };

  const handleDelete = (currencyAmount: any, id: any) => {
    const deleteInfo = {
      currencyAmount: currencyAmount,
      id: id,
    };
    dispatch(deleteAsset(deleteInfo));
    setIsDeleting(false);
  };

  useEffect(() => {
    dispatch(fetchCoins({ start: 1, limit: 400, convert: currency }));
  }, [currency]);

  useEffect(() => {
    getCoinPriceOnDate();
  }, [currency, coinSymbol, dateUnix]);

  useEffect(() => {
    handlePurchase();
  }, [coinPrice]);

  return (
    <div>
      <div className="mb-8 mt-16">
        <div className="mx-32 flex justify-between">
          <h1 className="text-3xl">Portfolio</h1>
          <button
            className="rounded-lg bg-slate-800 px-16 py-3 hover:bg-slate-600"
            onClick={() => setIsAddingAsset(!isAddingAsset)}
          >
            Add Asset
          </button>
        </div>
      </div>
      <div
        className={
          isAddingAsset
            ? "absolute bg-black w-1/2 h-2/5 left-1/4 top-1/3 rounded-md border border-white z-10"
            : "hidden"
        }
      >
        <div className="flex justify-between mx-16 mt-8">
          <p className="text-3xl">Purchase Crypto:</p>
          <p
            className={
              purchaseAmountChosen ? "ml-6 text-3xl text-green-500" : "hidden"
            }
          >
            {assetHeader
              .split(" ")
              .join(` ${coinSymbol} - - ${currencySymbol}`)}
          </p>
          <p className={noPurchase ? "ml-6 text-lg text-red-500" : "hidden"}>
            Select purchase amount before continuing
          </p>
          <p
            className={
              purchaseNotNumber ? "ml-6 text-lg text-red-500" : "hidden"
            }
          >
            Purchase amount must be a number and greater than 0
          </p>
          <button
            className="p-1 border border-white rounded-full hover:text-black hover:bg-white"
            onClick={() => setIsAddingAsset(false)}
          >
            <Xmark />
          </button>
        </div>
        <div className="flex justify-between mx-16 h-full mt-8">
          <div className="h-3/5 bg-slate-800 w-1/3 rounded-md mr-16 flex flex-col items-center justify-around">
            <div className="mt-10">
              <Defaulticon coin={coinSymbol} height="h-16" />
            </div>
            {coinSymbol !== "" ? (
              <span className="text-3xl">
                {coinName} ({coinSymbol})
              </span>
            ) : (
              <span className="text-lg">Select Crypto-Currency</span>
            )}
          </div>
          <div className="h-3/5 w-2/3 rounded-md ml-16 relative">
            <div
              className="flex items-center justify-between bg-slate-800 p-2 rounded-md cursor-pointer hover:bg-slate-600"
              onClick={() => {
                setIsCoinSelect(!isCoinSelect);
                setIsPurchaseSelect(false);
              }}
            >
              <div className="flex items-center">
                <Defaulticon coin={coinSymbol} height="h-8" />
                <span className="ml-2">
                  {coinName} ({coinSymbol})
                </span>
              </div>
              <Uparrow isOpen={isCoinSelect} />
            </div>
            <div
              className={
                isCoinSelect
                  ? "border absolute z-10 bg-slate-900 overflow-y-scroll h-96 w-full"
                  : "hidden"
              }
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 p-2 rounded-sm bg-slate-600 text-white dark:caret-white"
              />
              {loading && <div className="loading"></div>}
              {data.length &&
                data
                  .filter((coin) =>
                    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((coin) => {
                    return (
                      <div
                        key={coin.symbol + coin.id}
                        className="p-3 hover:bg-slate-600 cursor-pointer flex justify-between"
                        onClick={() => {
                          setCoinSymbol(coin.symbol);
                          setCoinName(coin.name);
                          setBuyWith(currency);
                          setIsCoinSelect(false);
                        }}
                      >
                        <div className="flex items-center">
                          <Defaulticon coin={coin.symbol} height="h-6" />
                          <span>
                            {coin.name} ({coin.symbol})
                          </span>
                        </div>
                        <span>
                          {currencySymbol} {coinPrice}
                        </span>
                      </div>
                    );
                  })}
            </div>
            <div
              className="flex items-center justify-between bg-slate-800 p-2 rounded-md cursor-pointer hover:bg-slate-600 mt-4"
              onClick={() => {
                setIsPurchaseSelect(!isPurchaseSelect);
                setIsCoinSelect(false);
              }}
            >
              <span className="ml-2">{purchaseHeader}</span>
              <Uparrow isOpen={isPurchaseSelect} />
            </div>
            <div
              className={
                isPurchaseSelect && coinSymbol !== ""
                  ? "border absolute z-10 bg-slate-900 h-32 w-full flex flex-col justify-around"
                  : "hidden"
              }
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={purchaseAmount}
                  placeholder="Purchase Amount. . ."
                  className="w-1/2 p-2 rounded-sm bg-slate-700 text-white dark:caret-white ml-4 text-left"
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                />
                <button
                  className="flex items-center bg-slate-700 rounded-md p-2"
                  onClick={() => setIsBuyWithSelect(!isBuyWithSelect)}
                >
                  <span>{buyWith}</span> <Uparrow isOpen={isBuyWithSelect} />{" "}
                </button>
                <div className="relative">
                  <div
                    className={
                      isBuyWithSelect
                        ? "absolute z-10 bg-slate-800 -left-30 top-5 flex flex-col w-24"
                        : "hidden"
                    }
                  >
                    <button
                      className="p-2 hover:bg-slate-600"
                      onClick={() => {
                        setBuyWith(currency);
                        setIsBuyWithSelect(false);
                      }}
                    >
                      {currency}
                    </button>
                    <button
                      className=" p-2 hover:bg-slate-600"
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
                  className="bg-slate-700 p-2 rounded-lg mr-4 hover:bg-slate-500"
                  onClick={() => handlePurchase()}
                >
                  <Arrowright />
                </button>
              </div>
              <div className="flex items-center mx-6 justify-between">
                {buyWith === currency ? (
                  <div className="flex">
                    <span className="mr-1">{currency}: </span>
                    <span>
                      {currencySymbol} {addCommas(Number(purchaseAmount))}
                    </span>
                  </div>
                ) : (
                  <div className="flex">
                    <span className="mr-1">{coinSymbol}: </span>
                    <span>{addCommas(Number(purchaseAmount))}</span>
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
                      {currencySymbol}{" "}
                      {addCommas(Number(purchaseAmount) * coinPrice)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between bg-slate-800 p-2 rounded-md cursor-pointer mt-4">
              <span className="ml-2">Purchase Date</span>
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(date: any) => setStartDate(date)}
                  maxDate={new Date()}
                  className="date-cal"
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
            <div className="flex justify-between mt-5">
              <button
                className="bg-slate-800 w-56 p-3 rounded-md hover:bg-slate-600"
                onClick={() => setIsAddingAsset(false)}
              >
                Cancel
              </button>
              <button
                className="bg-violet-800 w-56 p-3 rounded-md hover:bg-violet-950"
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
      <div className="bg-slate-800 rounded-lg mb-6 flex justify-between p-5 mx-32 items-center">
        <div className=" bg-slate-600 w-48 rounded-md flex flex-col items-center">
          <div className="my-4">
            <Bankicon />
          </div>
          <span className="text-xl mb-4">Bank</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-2 underline">Total Bank Funds</span>
          <span className="mt-2">
            {currencySymbol}
            {addCommas(totalFunds)}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-2 underline">Total Crypto-Asset Value</span>
          <span className="mt-2">
            {currencySymbol}
            {addCommas(assetValue)}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-2 underline">Total Wealth</span>
          <span className="mt-2">
            {currencySymbol}
            {addCommas(totalFunds + assetValue)}
          </span>
        </div>
        <div>
          <div
            className="flex items-center justify-between bg-slate-600 p-4 rounded-md cursor-pointer hover:bg-slate-400"
            onClick={() => {
              setIsCoinAssetsSelect(!isCoinAssetsSelect);
            }}
          >
            <div className="flex items-center">
              <span className="ml-2">Coins Owned</span>
            </div>
            <Uparrow isOpen={isCoinAssetsSelect} />
          </div>
          {isCoinAssetsSelect && (
            <div className="border absolute z-10 bg-slate-900 overflow-y-scroll h-80">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setAssetSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 p-2 rounded-sm bg-slate-600 text-white dark:caret-white"
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
                        className="p-3 hover:bg-slate-600 cursor-pointer flex justify-between"
                      >
                        <div className="flex items-center">
                          <Defaulticon coin={asset.coinSymbol} height="h-4" />
                          <span>
                            ({asset.coinSymbol}) - {asset.coinAmount}
                          </span>
                        </div>
                        <span>
                          {currencySymbol}
                          {asset.currencyAmount}
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
              className="flex items-center bg-slate-600 hover:bg-slate-400 p-4 rounded-md mr-4"
              onClick={() => setOpenFundsAdd(true)}
            >
              <span className="mr-3">Add Funds</span>
              <Sellicon />
            </button>
          ) : (
            <div className="p-4 bg-slate-900 flex w-64">
              <input
                type="text"
                placeholder="Add Funds..."
                value={addFundsAmount}
                onChange={(e) => setAddFundsAmount(e.target.value)}
                className="w-full p-2 rounded-sm bg-slate-600 text-white dark:caret-white"
              />
              <button
                onClick={handleAddFunds}
                className="p-2 ml-3 rounded-md bg-slate-600"
              >
                <Arrowright />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col mx-32">
        {loading && <div className="loading"></div>}
        {data.length &&
          portfolio.map((asset) => {
            const coin = data.find((coin) => coin.name === asset.coinName);
            const capToVol = (
              (coin.quote?.[currency].volume_24h /
                coin.quote?.[currency].market_cap) *
              100
            ).toFixed(3);
            const circToMax = coin.circulating_supply / coin.max_supply;
            const priceChange24 =
              (coin.quote?.[currency].percent_change_24h / 100) *
              coin.quote?.[currency].price;
            return (
              <div
                className="bg-slate-800 rounded-lg mb-6 flex justify-between p-5 relative"
                key={asset.coinSymbol}
              >
                <div className=" bg-slate-600 w-72 rounded-md flex flex-col items-center justify-center">
                  <div className="mb-12">
                    <Defaulticon coin={asset.coinSymbol} height="h-16" />
                  </div>
                  {coinSymbol !== "" ? (
                    <span className="text-3xl">
                      {asset.coinName} ({asset.coinSymbol})
                    </span>
                  ) : (
                    <span className="text-lg">Select Crypto-Currency</span>
                  )}
                </div>
                <div className="flex flex-col w-3/4">
                  <div className="flex flex-col mx-8 border-b-2 border-gray-400 pb-6">
                    <div className="flex justify-between mb-4">
                      <h1 className="text-2xl">Market Price</h1>
                      <div>
                        {isSelling && (
                          <div className="absolute z-10 bg-slate-900 p-3 rounded-md left-1/2 top-1/3 flex flex-col items-center">
                            <span>Amount to sell?</span>
                            <div className="flex items-center my-4">
                              <input
                                type="text"
                                value={sellAmount}
                                placeholder="Sale Amount. . ."
                                className="w-2/3 p-2 rounded-sm bg-slate-700 text-white dark:caret-white ml-4 text-left"
                                onChange={(e) => setSellAmount(e.target.value)}
                              />
                              <button
                                className="flex items-center bg-slate-700 rounded-md p-2 mx-4 hover:bg-slate-400"
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
                                      ? "absolute z-10 bg-slate-600 top-5 -left-22 flex flex-col rounded-md"
                                      : "hidden"
                                  }
                                >
                                  <button
                                    className="py-2 px-4 hover:bg-slate-400"
                                    onClick={() => {
                                      setSellWith(currency);
                                      setIsSellWithSelect(false);
                                    }}
                                  >
                                    {currency}
                                  </button>
                                  <button
                                    className=" py-2 px-4 hover:bg-slate-400"
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
                                className="p-3 rounded-md bg-slate-600 hover:bg-slate-400"
                                onClick={() => {
                                  let soldAmount;
                                  let soldCoinAmount;
                                  if (sellWith === currency) {
                                    soldAmount = sellAmount;
                                    soldCoinAmount =
                                      (Number(sellAmount) / coinPrice) *
                                      asset.coinAmount;
                                  } else {
                                    soldAmount = addCommas(
                                      Number(sellAmount) * coinPrice
                                    );
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
                          <div className="absolute z-10 bg-slate-900 p-4 rounded-md flex flex-col items-center left-1/2 top-1/3">
                            <span>
                              By deleting this, you agree to sell the entire
                              asset
                            </span>
                            <button
                              className="p-3 bg-slate-600 hover:bg-slate-400 my-4 rounded-lg"
                              onClick={() =>
                                handleDelete(asset.currencyAmount, asset.id)
                              }
                            >
                              Delete & Sell
                            </button>
                          </div>
                        )}
                        <button
                          className="p-2 bg-slate-600 rounded-md hover:bg-slate-400 mr-2"
                          onClick={() => setIsSelling(!isSelling)}
                        >
                          <Sellicon />
                        </button>
                        <button
                          className="p-2 bg-slate-600 rounded-md hover:bg-slate-400 ml-2"
                          onClick={() => setIsDeleting(!isDeleting)}
                        >
                          <Trashicon />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col items-center">
                        <span className="mb-2 underline">Current Price</span>
                        <span>
                          {currencySymbol}{" "}
                          {addCommas(coin.quote?.[currency].price)}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="mb-2 underline">Price Change 24h</span>
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
                      <div className="flex flex-col items-center">
                        <span className="underline">
                          Volume % of Market Cap
                        </span>
                        <div className="my-2">
                          <div className="bg-gray-400 w-40 h-3 rounded-lg">
                            <div
                              className={
                                Number(capToVol) > 4
                                  ? "bg-green-500 h-3 rounded-lg"
                                  : "bg-red-500 h-3 rounded-lg"
                              }
                              style={{
                                width:
                                  Number(capToVol) > 8 ? `${capToVol}%` : "8%",
                              }}
                            ></div>
                          </div>
                        </div>
                        <span>{capToVol}%</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="underline">
                          Circ Supply vs. Max Supply
                        </span>
                        <div className="my-2">
                          <div className="bg-gray-400 w-40 h-3 rounded-lg">
                            <div
                              className="bg-teal-400 h-3 rounded-lg"
                              style={{
                                width:
                                  Number(circToMax * 100) > 8
                                    ? `${circToMax * 100}%`
                                    : "8%",
                              }}
                            ></div>
                          </div>
                        </div>
                        <span>
                          {addCommas(coin.circulating_supply).split(".")[0]} /{" "}
                          {addCommas(coin.max_supply).split(".")[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col mx-8 pt-6">
                    <div className="flex justify-between mb-4">
                      <h1 className="text-2xl">Your Holdings</h1>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col items-center">
                        <span className="mb-2 underline">Coins Held</span>
                        <span>{asset.coinAmount.toFixed(5)}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="mb-2 underline">
                          Fiat Value at Purchase
                        </span>
                        <div className="flex items-center">
                          <span>
                            {currencySymbol}
                            {asset.currencyAmount}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="mb-2 underline">
                          Current Fiat Value
                        </span>
                        <div className="flex items-center">
                          <Updownarrow
                            coin={
                              Number(coin.quote?.[currency].price) -
                              Number(asset.currencyAmount.split(",").join(""))
                            }
                          />
                          <span
                            className={
                              Number(coin.quote?.[currency].price) >
                              Number(asset.currencyAmount.split(",").join(""))
                                ? "text-green-400"
                                : "text-red-500"
                            }
                          >
                            {currencySymbol}
                            {addCommas(
                              coin.quote?.[currency].price * asset.coinAmount
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="underline">
                          Value Change Since Purchase
                        </span>
                        <div className="my-2 flex items-center">
                          <Updownarrow
                            coin={
                              Number(coin.quote?.[currency].price) *
                                Number(asset.coinAmount) -
                              Number(asset.currencyAmount.split(",").join(""))
                            }
                          />
                          <span
                            className={
                              Number(coin.quote?.[currency].price) *
                                Number(asset.coinAmount) >
                              Number(asset.currencyAmount.split(",").join(""))
                                ? "text-green-400 mr-3"
                                : "text-red-500 mr-3"
                            }
                          >
                            {" "}
                            {currencySymbol}
                            {addCommas(
                              Math.abs(
                                Number(coin.quote?.[currency].price) *
                                  Number(asset.coinAmount) -
                                  Number(
                                    asset.currencyAmount.split(",").join("")
                                  )
                              )
                            )}
                          </span>
                          <Updownarrow
                            coin={
                              Number(coin.quote?.[currency].price) *
                                Number(asset.coinAmount) -
                              Number(asset.currencyAmount.split(",").join(""))
                            }
                          />
                          <span
                            className={
                              Number(coin.quote?.[currency].price) *
                                Number(asset.coinAmount) >
                              Number(asset.currencyAmount.split(",").join(""))
                                ? "text-green-400"
                                : "text-red-500"
                            }
                          >
                            {(
                              (Math.abs(
                                Number(coin.quote?.[currency].price) *
                                  Number(asset.coinAmount) -
                                  Number(
                                    asset.currencyAmount.split(",").join("")
                                  )
                              ) /
                                Number(
                                  asset.currencyAmount.split(",").join("")
                                )) *
                              100
                            ).toFixed(3)}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="mb-2 underline">Purchase Date</span>
                        <span>{asset.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
