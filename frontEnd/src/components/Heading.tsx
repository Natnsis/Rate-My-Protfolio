import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Award, Bot, House, Mail } from "lucide-react";
import { ModeToggle } from "./ui/mode-toggle";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const iconBase = "flex flex-col justify-center items-center cursor-pointer";
type PageName = "home" | "message" | "leaderboards" | "ai";

interface PropInterface {
  page: PageName;
}

const Heading = ({ page }: PropInterface) => {
  const [isHome, setIsHome] = useState(false);
  const [isMessages, setIsMessages] = useState(false);
  const [isLeaderboards, setIsLeaderboards] = useState(false);
  const [isAi, setIsAi] = useState(false);

  useEffect(() => {
    setIsHome(page === "home");
    setIsMessages(page === "message");
    setIsLeaderboards(page === "leaderboards");
    setIsAi(page === "ai");
  }, [page]);

  return (
    <header className="flex justify-between px-10 pb-3 border-b">
      <h1 className="text-4xl font-bbh text-primary">R.M.P</h1>

      <nav className="flex gap-10 items-center">
        <ModeToggle />

        <Link
          to="/dashboard"
          className={`${iconBase} ${
            isHome ? "text-yellow-400 underline" : "text-gray-400"
          }`}
        >
          <House size={24} />
          Home
        </Link>

        <Link
          to="/leaderboards"
          className={`${iconBase} ${
            isLeaderboards ? "text-yellow-400 underline" : "text-gray-400"
          }`}
        >
          <Award size={24} />
          Leaderboards
        </Link>

        <Link
          to="/report"
          className={`${iconBase} ${
            isMessages ? "text-yellow-400 underline" : "text-gray-400"
          }`}
        >
          <Mail size={24} />
          Reviews
        </Link>

        <Link
          to="/bot"
          className={`${iconBase} ${
            isAi ? "text-yellow-400 underline" : "text-gray-400"
          }`}
        >
          <Bot size={24} />
          AI
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Heading;
