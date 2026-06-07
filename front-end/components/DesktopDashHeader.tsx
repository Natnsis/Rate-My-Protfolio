"use client";
import { BellIcon, Medal, MessageSquareIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";

const DesktopDashHeader = () => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <header className="flex justify-between border-b pb-3 items-center">
        <div className="flex gap-1 items-center">
          <Image src="/logo.png" width={50} height={50} alt="logo-img" />
          <h1 className="font-extrabold text-lg">FolioHub</h1>
        </div>
        <div className="flex gap-3">
          <Button>Feed</Button>
          <Button variant="outline">Explore</Button>
          <Button variant="outline">Favorites</Button>
          <Button variant="outline">Statistics</Button>
          <Button variant="outline">Leaderboards</Button>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="ghost">
            <SearchIcon />
          </Button>
          <Button variant="ghost">
            <BellIcon />
          </Button>
          <Button variant="ghost">
            <MessageSquareIcon />
          </Button>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex gap-10 mt-5 pb-5">
        <div className="flex gap-5 pr-10">
          <Avatar className="h-15 w-15">
            <AvatarFallback>
              <p className="text-3xl">+</p>
            </AvatarFallback>
          </Avatar>

          <Avatar className="h-15 w-15">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <Avatar className="h-15 w-15">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <Avatar className="h-15 w-15">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <Avatar className="h-15 w-15">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <Avatar className="h-15 w-15">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default DesktopDashHeader;
