import { ArrowUpDown, Heart, Sparkle, Trophy } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Features = () => {
  const topUsers = [
    {
      id: 1,
      name: "Marta Cole",
      likes: "21k",
    },
    {
      id: 2,
      name: "Aria Chen",
      likes: "1.9k",
    },
    {
      id: 3,
      name: "Jonas Reid",
      likes: "1.7k",
    },
  ];
  return (
    <div className="mt-[20vh]">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl">Built for developers who ship</h1>
        <p className="text-muted-foreground">
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

          <div className="mt-10">
            <div className="grid grid-cols-3 w-[70vw] gap-5 mt-10">
              <Card className="col-span-1 p-5">
                <Heart />
                <h1 className="text-xl">Structured ratings</h1>
                <p className="w-2/3 text-muted-foreground">
                  Not just likes — devs score your UI, UX and code separately,
                  so feedback actually tells you what to fix.
                </p>
              </Card>
              <Card className="p-5 col-span-2">
                <div className="flex w-full">
                  <div className="w-1/2">
                    <Trophy />
                    <h1 className="text-xl my-5">Climb the leaderboard</h1>
                    <p className="text-muted-foreground">
                      Every like counts toward your rank. Weekly and all-time
                      boards keep the best portfolios visible — and keep you
                      shipping.
                    </p>
                  </div>
                  <div className="w-1/2 flex justify-center items-center">
                    <div className="flex flex-col gap-2 w-5/6 px-3">
                      {topUsers.map((t, index) => (
                        <div
                          className="p-2 flex justify-between items-center bg-gray-300 rounded-lg"
                          key={index}
                        >
                          <div className="flex gap-2 items-center">
                            <p>{t.id}</p>
                            <div className="flex gap-2 items-center">
                              <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <h1>{t.name}</h1>
                            </div>
                          </div>
                          <p>{t.likes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
