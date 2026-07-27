import { Card } from "./ui/card";

const Demo = () => {
  return (
    <div className="flex justify-center h-[80vh]">
      <div className="grid grid-cols-4 gap-4 p-4 w-[70vw]">
        <Card className="col-span-2 row-span-2 rounded-xl p-6 flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-neutral-400">
            01
          </span>
          <h3 className="text-xl font-bold">2x2 Hero Block</h3>
        </Card>

        <Card className="col-span-1 row-span-1 rounded-xl p-4">
          <span className="text-xs text-neutral-400">02</span>
          <p className="font-semibold text-sm mt-2">1x1 Top</p>
        </Card>

        <Card className="col-span-1 row-span-2 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs text-neutral-400">04</span>
          <p className="font-semibold text-sm">2x1 Tall Right</p>
        </Card>

        <Card className="col-span-1 row-span-1  rounded-xl p-4">
          <span className="text-xs text-neutral-400">Top rated this week</span>
          <p className="font-semibold text-sm mt-2">9.4 avg score</p>
        </Card>

        <Card className="col-span-2 row-span-1 rounded-xl p-4">
          <span className="">🔥 47 reactions</span>
          <p className="font-semibold text-sm mt-1">"Insane hover states"</p>
        </Card>

        <Card className="col-span-2 row-span-1 rounded-xl p-4">
          <p className="font-semibold text-sm mt-1">1x2 Wide Bottom Right</p>
        </Card>
      </div>
    </div>
  );
};

export default Demo;
