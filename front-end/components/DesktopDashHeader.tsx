import { BellIcon, Medal, MessageSquareIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const DesktopDashHeader = () => {
  return (
    <div>
      <header className="flex justify-between border-b pb-3">
        <div className="flex gap-1 items-center">
          <Image src="/logo.png" width={50} height={50} alt="logo-img" />
          <h1 className="font-extrabold text-lg">FolioHub</h1>
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

      <div className="flex gap-10 mt-5 border-b pb-5">
        <div className="flex gap-5 border-r pr-10">
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

        <div className="w-full">
          <div className="flex justify-between w-full">
            <div className="flex gap-2 items-center">
              <Medal size={15} />
              <h1 className="text-sm">Top Creators This Week</h1>
            </div>
            <p className="font-light text-primary">Updated Daily</p>
          </div>
          <div className="flex items-center gap-10 mt-2 w-full overflow-y-auto">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl">1</h1>
              <Avatar className="h-15 w-15">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h1>Natnael Sisay</h1>
                <p>4.3k views</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <h1 className="text-2xl">2</h1>
              <Avatar className="h-15 w-15">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h1>Natnael Sisay</h1>
                <p>4.3k views</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <h1 className="text-2xl">3</h1>
              <Avatar className="h-15 w-15">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h1>Natnael Sisay</h1>
                <p>4.3k views</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <h1 className="text-2xl">4</h1>
              <Avatar className="h-15 w-15">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h1>Natnael Sisay</h1>
                <p>4.3k views</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopDashHeader;
