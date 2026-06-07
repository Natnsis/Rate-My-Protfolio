import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import Image from "next/image";

const getHeight = (index: number) => {
  const heights = [
    "h-56",
    "h-72",
    "h-64",
    "h-80",
    "h-64",
    "h-96",
    "h-72",
    "h-56",
  ];
  return heights[index % heights.length];
};

const BentoComponents = ({ data }: { data: any }) => {
  return (
    <div className="w-full">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 space-y-6">
        {data.map((item, index) => (
          <Card
            key={index}
            className={`p-6 ${getHeight(index)} break-inside-avoid flex flex-col justify-between`}
          >
            <div>
              <div className="flex gap-3 items-center">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BentoComponents;
