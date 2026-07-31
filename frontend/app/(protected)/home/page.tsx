"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Compass,
  Home,
  MessagesSquare,
  Sparkles,
  Trophy,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const page = () => {
  const path = usePathname();
  const router = useRouter();
  return (
    <div className="h-[92vh]">
      <div className="flex h-full">
        <div className="mx-10 items-center flex h-full">
          <div className="flex flex-col justify-center">
            <div className="flex flex-col gap-2 border p-3 rounded-full">
              <Button variant={path === "/home" ? "default" : "ghost"}>
                <Home />
              </Button>
              <Button variant={path === "/explore" ? "default" : "ghost"}>
                <Compass />
              </Button>
              <Button variant={path === "/leaderboards" ? "default" : "ghost"}>
                <Trophy />
              </Button>
              <Button variant={path === "/ai" ? "default" : "ghost"}>
                <Sparkles />
              </Button>
              <Button
                variant={path === "/community-roast" ? "default" : "ghost"}
                onClick={() => router.push("/profile")}
              >
                <MessagesSquare />
              </Button>
              <Separator />
              <Button
                variant={path === "/profile" ? "default" : "ghost"}
                onClick={() => router.push("/profile")}
              >
                <User />
              </Button>
            </div>
          </div>
        </div>
        <div className="py-3 h-full overflow-y-auto w-full">
          <h1 className="text-4xl">Fresh from the community</h1>
          <p className="text-muted-foreground">
            New versions from developers you follow
          </p>
          <div className="grid grid-cols-4 py-5 mt-5 gap-5 w-full">
            <div className="w-full h-[45vh] bg-gray-200"></div>
            <div className="w-full h-[45vh] bg-gray-200"></div>
            <div className="w-full h-[45vh] bg-gray-200"></div>
            <div className="w-full h-[45vh] bg-gray-200"></div>
            <div className="w-full h-[45vh] bg-gray-200"></div>
            <div className="w-full h-[45vh] bg-gray-200"></div>
            <div className="w-full h-[45vh] bg-gray-200"></div>
            <div className="w-full h-[45vh] bg-gray-200"></div>
            <div className="w-full h-[45vh] bg-gray-200"></div>
            <div className="w-full h-[45vh] bg-gray-200"></div>
            <div className="w-full h-[45vh] bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
