import { Filtericon, Arrowright, Xmark } from "../svgComps";

export const Rangefilter = ({
  filterState,
  currentFilterState,
  handleFilter,
  handleFilterExit,
  name,
  handleRangeRender,
  handleLowerValue,
  lowerValue,
  handleUpperValue,
  upperValue,
  handleRangeClear,
}: any) => {
  return (
    <div
      className={
        filterState === currentFilterState
          ? "p-4 rounded-sm hover:bg-slate-600 absolute h-52 z-10 flex items-center flex-col -left-10 -top-2"
          : "p-2 rounded-sm hover:bg-slate-800"
      }
      onMouseEnter={() => handleFilter(currentFilterState)}
      onMouseLeave={handleFilterExit}
    >
      <div className="flex items-center mb-4">
        <span>{name}</span>
        <Filtericon />
      </div>
      <form
        className={
          filterState === currentFilterState
            ? "ml-2 h-8 flex flex-col items-center"
            : "hidden"
        }
        action=""
        onSubmit={handleRangeRender}
      >
        <input
          type="text"
          className="bg-slate-600 rounded-sm w-28 mr-1 p-1 dark:caret-white border-gray-300 border"
          onChange={handleLowerValue}
          value={lowerValue}
          placeholder="Lower Value"
        />
        <input
          type="text"
          className="bg-slate-600 rounded-sm w-28 mr-1 mt-4 p-1 dark:caret-white border-gray-300 border"
          onChange={handleUpperValue}
          value={upperValue}
          placeholder="Upper Value"
        />
        <div className="flex">
          <button
            className="hover:bg-white bg-gray-800 p-1 rounded-sm mt-6 hover:text-black mr-4"
            onClick={handleRangeRender}
          >
            <Arrowright />
          </button>
          <button
            className="hover:bg-white bg-gray-800 p-1 rounded-sm mt-6 hover:text-black ml-4"
            onClick={() => handleRangeClear("Price")}
          >
            <Xmark />
          </button>
        </div>
      </form>
    </div>
  );
};
