import Link from "next/link";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="flex justify-between sticky top-0 bg-white/30 backdrop-blur-xl py-3">
      <div className="flex gap-2 items-center">
        <img src="/file.svg" className="h-6 w-10" />
        <h1 className="text-2xl font-extrabold">FolioHub</h1>
      </div>
      <nav className="flex gap-8">
        <Link href="#features">Features</Link>
        <Link href="#social-proof">Social Proof</Link>
        <Link href="#live-trending">Live Trending</Link>
        <Link href="#portfolio-battles">Portfolio Battles</Link>
      </nav>
      <div className="flex gap-5">
        <Button variant="outline" className="rounded-full">
          Book A Demo
        </Button>
        <Button className="rounded-full">Get Started</Button>
      </div>
    </header>
  );
};

export default Header;
