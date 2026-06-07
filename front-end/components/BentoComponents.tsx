import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, Save, Share, Expand, Eye } from "lucide-react";

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
            className={`relative overflow-hidden ${getHeight(index)} break-inside-avoid p-0 group`}
          >
            <Image
              alt="feed-img"
              src={item.image || "/demo.png"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />

            <div className="relative flex flex-col justify-between h-full p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="font-bold text-white">Natnael Sisay</h1>
                  <p className="text-xs font-light text-white/80">FrontEnd Developer</p>
                </div>
                <div className="flex items-center gap-1 text-white text-sm">
                  <Eye className="h-4 w-4" />
                  1.2k
                </div>
              </div>

              <div className="flex flex-col items-end lg:items-center lg:justify-center lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col gap-2 lg:grid lg:grid-cols-2">
                  <Button variant="secondary" size="sm"><Heart className="h-4 w-4" /></Button>
                  <Button variant="secondary" size="sm"><Save className="h-4 w-4" /></Button>
                  <Button variant="secondary" size="sm"><Share className="h-4 w-4" /></Button>
                  <Button variant="secondary" size="sm"><Expand className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BentoComponents;
