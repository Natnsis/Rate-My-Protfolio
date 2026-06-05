import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChartArea,
  HomeIcon,
  LogOut,
  Medal,
  StarIcon,
  Telescope,
} from "lucide-react";
import Image from "next/image";

const page = () => {
  return (
    <div className="flex w-full">
      <div className="w-[20%] px-5">
        <div className="flex gap-1 items-center">
          <Image src="/logo.png" width={50} height={50} alt="logo-img" />
          <h1 className="font-extrabold text-lg">FolioHub</h1>
        </div>
        <div className="flex flex-col items-center mt-5">
          <Avatar className="h-15 w-15">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-center text-lg">John Doe</h1>
            <p className="font-light text-sm">FrontEnd Dev</p>
          </div>
          <div className="flex justify-between w-full mt-10">
            <div>
              <h1 className="text-center text-2xl font-bold">523</h1>
              <p className="text-center font-light">Posts</p>
            </div>
            <div>
              <h1 className="text-center text-2xl font-bold">32.4k</h1>
              <p className="text-center font-light">Followers</p>
            </div>
            <div>
              <h1 className="text-center text-2xl font-bold">23</h1>
              <p className="text-center font-light">Following</p>
            </div>
          </div>

          <div className="w-full mt-10 flex flex-col gap-2">
            <Button className="w-full">
              <HomeIcon />
              <h1>Feed</h1>
            </Button>
            <Button className="w-full" variant="outline">
              <Telescope />
              <h1>Explore</h1>
            </Button>
            <Button className="w-full" variant="outline">
              <StarIcon />
              <h1>Favorites</h1>
            </Button>
            <Button className="w-full" variant="outline">
              <ChartArea />
              <h1>Statstics</h1>
            </Button>
            <Button className="w-full" variant="outline">
              <Medal />
              <h1>Leaderboards</h1>
            </Button>
          </div>
        </div>
        <div className="mt-10 w-full">
          <Button className="w-full">
            <LogOut />
            <h1>Logout</h1>
          </Button>
        </div>
      </div>
      <div className="w-[75%]">heeh</div>
      <div className="w-[15%]">hehe</div>
    </div>
  );
};

export default page;
