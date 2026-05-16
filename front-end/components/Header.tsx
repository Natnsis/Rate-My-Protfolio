import Link from "next/link";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="flex justify-between">
      <div className="flex gap-2 items-center">
        <img src="/file.svg" className="h-6 w-10" />
        <h1 className="text-2xl font-extrabold">FolioHub</h1>
      </div>
      <nav className="flex gap-5">
        <Link href="/">Feature</Link>
        <Link href="/">Customer Stories</Link>
        <Link href="/">Resources</Link>
        <Link href="/">Pricing</Link>
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
