import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

const MobileHeader = () => {
  return (
    <div className="flex justify-between items-center px-2">
      <div className="flex  items-center">
        <Image src="/logo.png" width={50} height={50} alt="logo-img" />
        <h1 className="font-extrabold text-lg">FolioHub</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Features</DropdownMenuItem>
          <DropdownMenuItem>Social Proof</DropdownMenuItem>
          <DropdownMenuItem>Portfolio Battles</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Check Demo</DropdownMenuItem>
          <DropdownMenuItem>Get Started</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileHeader;
