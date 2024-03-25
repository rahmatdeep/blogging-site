export default function Skeleton() {
  return (
    <>
      <div role="status" className="pt-4 animate-pulse">
        <div className="p-4 border-b border-slate-200 pb-4 bg-slate-50 w-screen max-w-3xl">
          <div className="flex">
            <div className="h-4 w-4 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>
            <div className="flex justify-center flex-col pl-2 font-thin text-slate-500">
              <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>
          <div className="text-md font-thin">
            <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>
          </div>
          <div className="pt-4 text-slate-500 text-sm font-thin">
            <div className="h-2 bg-gray-200 rounded-full "></div>
          </div>
        </div>
      </div>
    </>
  );
}
