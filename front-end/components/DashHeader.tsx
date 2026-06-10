"use client";
import { BellIcon, MessageSquareIcon, SearchIcon, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";

const DashHeader = ({ show }: { show: boolean }) => {
  const router = useRouter();
  const path = usePathname();
  return (
    <div>
      <header className="flex justify-between border-b pb-3 items-center">
        <div className="flex gap-1 items-center">
          <Image src="/logo.png" width={50} height={50} alt="logo-img" />
          <h1 className="font-extrabold text-lg">FolioHub</h1>
        </div>

        <div className="hidden sm:flex gap-3">
          <Button
            onClick={() => router.push("/dashboard")}
            variant={path == "/dashboard" ? "default" : "ghost"}
          >
            Explore
          </Button>
          <Button
            onClick={() => router.push("/favorites")}
            variant={path == "/favorites" ? "default" : "ghost"}
          >
            Favorites
          </Button>
          <Button
            onClick={() => router.push("/statistics")}
            variant={path == "/statistics" ? "default" : "ghost"}
          >
            Statistics
          </Button>
          <Button
            onClick={() => router.push("/leaderboards")}
            variant={path == "/leaderboards" ? "default" : "ghost"}
          >
            Leaderboards
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <Button variant="ghost" className="hidden lg:block">
            <SearchIcon />
          </Button>
          <Button variant="ghost" className="hidden lg:block">
            <BellIcon />
          </Button>
          <Button variant="ghost" className="hidden lg:block">
            <MessageSquareIcon />
          </Button>

          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="sm:block lg:hidden" />
                <DropdownMenuGroup className="sm:block lg:hidden">
                  <DropdownMenuLabel>Search</DropdownMenuLabel>
                  <DropdownMenuItem>Notifications</DropdownMenuItem>
                  <DropdownMenuItem>Chat</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button - shown on small only */}
          <div className="block sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Routes</DropdownMenuLabel>
                  <DropdownMenuItem>Feed</DropdownMenuItem>
                  <DropdownMenuItem>Explore</DropdownMenuItem>
                  <DropdownMenuItem>Favorites</DropdownMenuItem>
                  <DropdownMenuItem>Statistics</DropdownMenuItem>
                  <DropdownMenuItem>Leaderboards</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Tools</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Search
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BellIcon className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquareIcon className="mr-2 h-4 w-4" />
                    Chat
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className={`pl-5 ${show ? "flex mt-5 pb-5 gap-10" : "hidden"}`}>
        <div className="flex gap-5 pr-10 w-full overflow-x-auto scrollbar-hide">
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

export default DashHeader;
