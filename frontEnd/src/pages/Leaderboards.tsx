import Heading from "@/components/Heading";
import Sidebar from "@/components/Sidebar";
import { Posts } from "@/constants/posts";
import { Heart } from "lucide-react";
import React from "react";

const Leaderboards = () => {
  return (
    <section className="h-screen">
      <div className="sticky top-5 pb-5 ">
        <Heading page="leaderboards" />
      </div>
      <div className="grid grid-cols-4 p-5 px-20 h-full gap-8 ">
        <Sidebar />
        <main className="col-span-3 overflow-auto p-5 h-[85vh]">
          <h1 className="font-bbh text-3xl">
            <span className="text-primary">Top 10</span> Ranking Portfolios
          </h1>
          <div className="flex flex-wrap gap-4 mt-10 w-full font-quintessential">
            {Posts.slice(0, 10).map((p, index) => (
              <div className="rounded-lg border-1 p-3 flex flex-col gap-1">
                <img src={p.image} className="w-40 h-40" alt="myPic" />
                <h1>{p.name}</h1>
                <p className="flex gap-1 text-sm ">
                  <Heart />
                  {p.likes}
                </p>
                <p className="text-end text-primary font-bbh text-2xl">
                  {index + 1}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
};

export default Leaderboards;
