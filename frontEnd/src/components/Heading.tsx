import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Award, Bot, House, Mail, Menu, X } from "lucide-react";
import { ModeToggle } from "./ui/mode-toggle";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/AuthStore";
import { useUserStore } from "@/store/UserStore";

const iconBase =
  "flex flex-col justify-center items-center cursor-pointer text-sm sm:text-base";

type PageName = "home" | "message" | "leaderboards" | "ai";

interface PropInterface {
  page: PageName;
}

const Heading = ({ page }: PropInterface) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const id = user?.id;
  const [menuOpen, setMenuOpen] = useState(false);

  const [isHome, setIsHome] = useState(false);
  const [isMessages, setIsMessages] = useState(false);
  const [isLeaderboards, setIsLeaderboards] = useState(false);
  const [isAi, setIsAi] = useState(false);

  const fetchUser = useUserStore((s) => s.getUser);
  const data = useUserStore((s) => s.user);

  useEffect(() => {
    if (!id) {
      navigate("/login");
      return;
    }
    fetchUser(id!);
  }, [id, fetchUser, navigate]);

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
    <header className="sticky top-0 z-50 flex justify-between items-center px-4 sm:px-10 py-3 border-b ">
      {/* Logo */}
      <h1 className="text-2xl sm:text-4xl font-bbh text-primary">R.M.P</h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 items-center">
        <ModeToggle />

        <Link
          to="/dashboard"
          className={`${iconBase} ${
            isHome ? "text-yellow-400 underline" : "text-gray-400"
          }`}
        >
          <House size={20} /> Home
        </Link>

        <Link
          to="/leaderboards"
          className={`${iconBase} ${
            isLeaderboards ? "text-yellow-400 underline" : "text-gray-400"
          }`}
        >
          <Award size={20} /> Leaderboards
        </Link>

        <Link
          to="/report"
          className={`${iconBase} ${
            isMessages ? "text-yellow-400 underline" : "text-gray-400"
          }`}
        >
          <Mail size={20} /> Reviews
        </Link>

        <Link
          to="/bot"
          className={`${iconBase} ${
            isAi ? "text-yellow-400 underline" : "text-gray-400"
          }`}
        >
          <Bot size={20} /> AI
        </Link>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={data?.avatarUrl} />
              <AvatarFallback>RMP</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50">
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

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden flex items-center gap-2">
        <ModeToggle />
        <button
          className="p-2 rounded-md hover:bg-gray-200/20"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full right-0 w-48 bg-card border border-border rounded-lg shadow-lg flex flex-col gap-2 p-3 z-50">
          <Link
            to="/dashboard"
            className={`${iconBase} ${
              isHome ? "text-yellow-400" : "text-gray-400"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <House size={20} /> Home
          </Link>
          <Link
            to="/leaderboards"
            className={`${iconBase} ${
              isLeaderboards ? "text-yellow-400" : "text-gray-400"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <Award size={20} /> Leaderboards
          </Link>
          <Link
            to="/report"
            className={`${iconBase} ${
              isMessages ? "text-yellow-400" : "text-gray-400"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <Mail size={20} /> Reviews
          </Link>
          <Link
            to="/bot"
            className={`${iconBase} ${
              isAi ? "text-yellow-400" : "text-gray-400"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <Bot size={20} /> AI
          </Link>

          {/* Mobile User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="mt-2">
                <AvatarImage src={data?.avatarUrl} />
                <AvatarFallback>RMP</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-50">
              <DropdownMenuLabel className="capitalize">
                {data?.firstName} {data?.lastName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
};

export default Heading;
