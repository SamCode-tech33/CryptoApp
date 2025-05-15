import { Filtericon, Arrowright, Trashicon } from "../svgComps";

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
  handleFullClear,
}: any) => {
  return (
    <div
      className={
        filterState === currentFilterState
          ? "p-4 rounded-sm dark:hover:bg-slate-600 absolute h-52 z-10 flex items-center flex-col -left-10 -top-2 bg-slate-300 w-40"
          : "p-2 rounded-sm dark:hover:bg-slate-800"
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
          className="dark:bg-slate-600 rounded-sm w-28 mr-1 p-1 dark:caret-white border-gray-300 border"
          onChange={handleLowerValue}
          value={lowerValue}
          placeholder="Lower Value"
        />
        <input
          type="text"
          className="dark:bg-slate-600 rounded-sm w-28 mr-1 mt-4 p-1 dark:caret-white border-gray-300 border"
          onChange={handleUpperValue}
          value={upperValue}
          placeholder="Upper Value"
        />
        <div className="flex justify-between my-4">
          <button
            className="dark:hover:bg-white dark:bg-gray-800 p-1 rounded-sm dark:hover:text-black bg-white hover:bg-gray-400 text-sm"
            onClick={() => handleRangeClear("Price")}
          >
            <Trashicon />
          </button>
          <button
            className="dark:hover:bg-white dark:bg-gray-800 p-1 rounded-sm dark:hover:text-black ml-1 bg-white hover:bg-gray-400"
            onClick={handleFullClear}
          >
            <span className="text-sm">Clear all</span>
          </button>
          <button
            className="dark:hover:bg-white dark:bg-gray-800 p-1 rounded-sm dark:hover:text-black ml-1 bg-white hover:bg-gray-400"
            onClick={handleRangeRender}
          >
            <Arrowright />
          </button>
        </div>
      </form>
    </div>
  );
};
