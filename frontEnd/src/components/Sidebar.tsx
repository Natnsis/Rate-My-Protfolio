import React from "react";

const Sidebar = () => {
  return (
    <div className="col-span-1 h-full gap-5 border-r-1 pr-5">
      <div className=" w-full  mt-10 rounded-lg p-5 border-1">
        <img
          src="/auth.png"
          alt="pfp"
          className="w-15 h-15 rounded-full border-2 "
        />
        <h1 className="font-bbh">Natnael Sisay</h1>

        <div className="border-t-1 p-5">
          <div className="flex justify-between">
            <h1>Likes:</h1>
            <p>21</p>
          </div>
          <div className="flex justify-between">
            <h1>Saved:</h1>
            <p>41</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
