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
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/AuthStore";
import { useUserStore } from "@/store/UserStore";
const iconBase = "flex flex-col justify-center items-center cursor-pointer";
type PageName = "home" | "message" | "leaderboards" | "ai";

interface PropInterface {
  page: PageName;
}

const Heading = ({ page }: PropInterface) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const id = user?.id;
  const [isHome, setIsHome] = useState(false);
  const [isMessages, setIsMessages] = useState(false);
  const [isLeaderboards, setIsLeaderboards] = useState(false);
  const [isAi, setIsAi] = useState(false);
  const fetchUser = useUserStore((s) => s.getUser);
  const data = useUserStore((s) => s.user);

  useEffect(() => {
    if (!id) {
      alert("User ID is undefined");
      navigate("/login");
    }

    fetchUser(id!);
  }, [id, fetchUser]);

  useEffect(() => {
    setIsHome(page === "home");
    setIsMessages(page === "message");
    setIsLeaderboards(page === "leaderboards");
    setIsAi(page === "ai");
  }, [page]);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate("/login");
  };

  return (
    <header className="flex justify-between px-10 pb-3 border-b font-poppins">
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
              <AvatarImage src={data?.avatarUrl} />
              <AvatarFallback>RMP</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="capitalize">
              {data?.firstName} {data?.lastName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center" onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Heading;
