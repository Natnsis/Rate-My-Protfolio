"use client";

import Sidebar from "@/components/Sidebar";

const page = () => {
  return (
    <div className="grid grid-cols-5 h-screen">
      <div>
        <Sidebar />
      </div>
      <div className="col-span-3">heh</div>
      <div className="border-l h-full">hehe</div>
    </div>
  );
};

export default page;
