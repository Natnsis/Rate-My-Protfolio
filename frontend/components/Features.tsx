import { ArrowUpDown, CupSoda, Heart, Sparkle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Features = () => {
  return (
    <div className="mt-30">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl">Built for developers who ship</h1>
        <p>
          Every part of DevFolio is built around one loop: post, get feedback,
          improve, post again.
        </p>
        <div>
          <div className="grid grid-cols-3 w-[70vw] gap-5 mt-10">
            <Card className="col-span-2 p-5 flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <ArrowUpDown />
                <h1 className="text-xl">Version-based posts</h1>
                <p className="w-2/3 text-muted-foreground">
                  Every redesign becomes a new version on the same post a
                  running timeline of your portfolio's evolution that other devs
                  can compare and react to.
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant={"outline"} size={"sm"}>
                  v1
                </Button>
                <Button variant={"outline"} size={"sm"}>
                  v2
                </Button>
                <Button size={"sm"}>v3</Button>
              </div>
            </Card>

            <Card className="col-span-1 p-5 bg-secondary">
              <Sparkle color="white" />
              <h1 className="text-xl text-white">AI Studio roasts</h1>
              <p className="w-2/3 text-white">
                Pick a project, toggle roast or feedback mode, and get an
                instant AI critique of your UI, UX and code — save it to your
                profile or drop it in the feed.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
