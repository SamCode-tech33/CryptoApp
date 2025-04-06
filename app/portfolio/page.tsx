export default async function Portfolio() {
  return (
    <div>
      <div className="mb-24 mt-16">
        <div className="mx-18 flex justify-between">
          <h1 className="text-3xl">Portfolio</h1>
          <button className="rounded-lg bg-slate-800 px-16 py-3 hover:bg-slate-600">
            Add Asset
          </button>
        </div>
      </div>
      <div className="flex flex-col mx-18">
        <div className="h-56 bg-slate-800 rounded-lg mb-12"></div>
      </div>
    </div>
  );
}
