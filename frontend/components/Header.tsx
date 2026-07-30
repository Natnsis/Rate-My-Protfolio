"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Header = () => {
  const router = useRouter();
  return (
    <div className="flex justify-between p-5">
      <h1 className="text-lg font-bold">DevFolio</h1>
      <nav className="flex gap-5">
        <Button variant={"link"}>Features</Button>
        <Button variant={"link"}>Leaderboards</Button>
        <Button variant={"link"}>Stories</Button>
      </nav>
      <div className="flex gap-3">
        <Button variant={"outline"} onClick={() => router.push("/auth")}>
          Sign in
        </Button>
        <Button>Get started</Button>
      </div>
    </div>
  );
};

export default Header;
