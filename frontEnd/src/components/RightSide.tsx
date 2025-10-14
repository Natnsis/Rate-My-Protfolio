import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const RightSide = () => {
  return (
    <div className="col-span-1 pt-5">
      <div className="rounded  border-1 w-full p-3">
        <h1>Post Your Portfolio</h1>
        <form action="" className="flex flex-col gap-5 mt-5">
          <Input placeholder="portfolio Link" />
          <Input placeholder="what do y'all think?" className="h-[20vh]" />
          <Button>Post</Button>
        </form>
      </div>
    </div>
  );
};

export default RightSide;
