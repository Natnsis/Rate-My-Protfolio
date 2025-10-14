import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Award, Bot, House, Mail, MessageCircle } from "lucide-react";

const Icons = "flex flex-col justify-center items-center cursor-pointer";

const Heading = () => {
  return (
    <header className="flex justify-between px-10 pb-3">
      <h1 className="text-4xl font-bbh text-primary">R.M.P</h1>
      <nav className="flex gap-15">
        <div className={Icons}>
          <House />
          Home
        </div>
        <div className={Icons}>
          <Mail />
          Reviews
        </div>
        <div className={Icons}>
          <Bot />
          AI
        </div>
        <div className={Icons}>
          <Award />
          Leaderboards
        </div>
        <div>
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
        </div>
      </nav>
    </header>
  );
};

export default Heading;
