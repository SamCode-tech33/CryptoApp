import { Rangefilter } from "../rangeFilter";
import { useState } from "react";

export const Coinfilter = ({
  handleFullClear,
  handleFilterRender,
  closeFocus,
}: any) => {
  const [coinName, setCoinName] = useState("");
  const [lowerPrice, setLowerPrice] = useState("");
  const [lower1, setLower1] = useState("");
  const [lower24, setLower24] = useState("");
  const [lower7, setLower7] = useState("");
  const [upperPrice, setUpperPrice] = useState("");
  const [upper1, setUpper1] = useState("");
  const [upper24, setUpper24] = useState("");
  const [upper7, setUpper7] = useState("");
  const [inputError, setInputError] = useState("");

  const handleReset = () => {
    setCoinName("");
    setLowerPrice("");
    setUpperPrice("");
    setLower1("");
    setUpper1("");
    setLower24("");
    setUpper24("");
    setLower7("");
    setUpper7("");
    setInputError("");
    handleFullClear();
  };

  const handleFilterSubmit = () => {
    let locationString = "";
    if (coinName !== "") {
      locationString = locationString + "&q=" + coinName;
    }
    if (lowerPrice !== "" && upperPrice !== "") {
      locationString =
        locationString + "&price=" + lowerPrice + "_" + upperPrice;
    } else if (
      (lowerPrice === "" && upperPrice !== "") ||
      (lowerPrice !== "" && upperPrice === "")
    ) {
      setInputError("price");
    }
    if (lower1 !== "" && upper1 !== "") {
      locationString = locationString + "&hour1=" + lower1 + "_" + upper1;
    } else if (
      (lower1 === "" && upper1 !== "") ||
      (lower1 !== "" && upper1 === "")
    ) {
      setInputError("hour1");
    }
    if (lower24 !== "" && upper24 !== "") {
      locationString = locationString + "&hour24=" + lower24 + "_" + upper24;
    } else if (
      (lower24 === "" && upper24 !== "") ||
      (lower24 !== "" && upper24 === "")
    ) {
      setInputError("hour24");
    }
    if (lower7 !== "" && upper7 !== "") {
      locationString = locationString + "&day7=" + lower7 + "_" + upper7;
    } else if (
      (lower7 === "" && upper7 !== "") ||
      (lower7 !== "" && upper7 === "")
    ) {
      setInputError("day7");
    }
    locationString.split("").shift();
    if (inputError === "") {
      handleFilterRender(locationString);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mx-6">
        <span className="md:text-lg">Filters</span>
        <button
          className="py-1 px-2.5 dark:bg-slate-700 rounded-full dark:hover:bg-slate-500 bg-violet-300 hover:bg-violet-400"
          onClick={closeFocus}
        >
          X
        </button>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col items-center p-2 rounded-sm">
          <span className="mb-4">Coin Name</span>
          <div className="flex items-center">
            <form className="flex h-8" action="">
              <input
                type="text"
                className="dark:bg-slate-600 rounded-sm dark:caret-white border-gray-300 border p-1"
                value={coinName}
                onChange={(e: any) => {
                  setCoinName(e.target.value);
                  setInputError("");
                }}
                placeholder="Coin..."
              />
            </form>
          </div>
        </div>
      </div>
      <div>
        <Rangefilter
          handleLowerValue={(e: any) => {
            setLowerPrice(e.target.value);
            setInputError("");
          }}
          lowerValue={lowerPrice}
          handleUpperValue={(e: any) => {
            setUpperPrice(e.target.value);
            setInputError("");
          }}
          upperValue={upperPrice}
          name="Price Range"
        />
      </div>
      <div>
        <Rangefilter
          handleLowerValue={(e: any) => {
            setLower1(e.target.value);
            setInputError("");
          }}
          lowerValue={lower1}
          handleUpperValue={(e: any) => {
            setUpper1(e.target.value);
            setInputError("");
          }}
          upperValue={upper1}
          name="1 Hour Percentage Change"
        />
      </div>
      <div>
        <Rangefilter
          handleLowerValue={(e: any) => {
            setLower24(e.target.value);
            setInputError("");
          }}
          lowerValue={lower24}
          handleUpperValue={(e: any) => {
            setUpper24(e.target.value);
            setInputError("");
          }}
          upperValue={upper24}
          name="24 Hour Percentage Change"
        />
      </div>
      <div>
        <Rangefilter
          handleLowerValue={(e: any) => {
            setLower7(e.target.value);
            setInputError("");
          }}
          lowerValue={lower7}
          handleUpperValue={(e: any) => {
            setUpper7(e.target.value);
            setInputError("");
          }}
          upperValue={upper7}
          name="7 Day Percentage Change"
        />
      </div>
      <div className="flex justify-between mx-6 mt-8">
        <button
          className="dark:bg-slate-700 p-2 rounded-sm dark:hover:bg-slate-500 bg-violet-300 hover:bg-violet-400"
          onClick={handleReset}
        >
          <span className="text-sm">Reset</span>
        </button>
        <button
          className="dark:bg-slate-700 p-2 rounded-sm dark:hover:bg-slate-500 bg-violet-300 hover:bg-violet-400"
          onClick={() => {
            handleFilterSubmit();
            closeFocus();
          }}
        >
          <span className="text-sm">Apply</span>
        </button>
      </div>
    </div>
  );
};
