import { Bell, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./mode-toggle";

const Topbar = () => {
  return (
    <div className="flex justify-between px-5">
      <div>devfolio</div>
      <div className="flex gap-5">
        <ModeToggle />
        <Button variant={"outline"}>
          <Bell />
        </Button>
        <Button>
          <Plus />
          New post
        </Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Topbar;
