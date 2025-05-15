export const Rangefilter = ({
  name,
  handleLowerValue,
  lowerValue,
  handleUpperValue,
  upperValue,
}: any) => {
  return (
    <div className="p-2 rounded-sm flex justify-center flex-col ml-4">
      <div className="flex items-center mb-4">
        <span>{name}</span>
      </div>
      <form className="flex items-center">
        <input
          type="text"
          className="dark:bg-slate-600 rounded-sm mr-2 p-1 dark:caret-white border-gray-300 border md:w-auto sm:w-32 w-28"
          onChange={handleLowerValue}
          value={lowerValue}
          placeholder="Min"
        />
        <span className="mr-2">-</span>
        <input
          type="text"
          className="dark:bg-slate-600 rounded-sm mr-4 p-1 dark:caret-white border-gray-300 border md:w-auto sm:w-32 w-28"
          onChange={handleUpperValue}
          value={upperValue}
          placeholder="Max"
        />
      </form>
    </div>
  );
};
