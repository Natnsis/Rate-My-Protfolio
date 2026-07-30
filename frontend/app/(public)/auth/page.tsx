"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Image } from "lucide-react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  return (
    <div className="flex h-screen">
      <div className="bg-secondary w-1/2 p-5 flex flex-col gap-5 text-white justify-between">
        <div className="flex gap-2">
          <h1 className=" font-bold text-xl">DevFlow</h1>
        </div>
        <div className="w-2/3">
          <h1 className="text-6xl">Ship it. Post it. Get roasted.</h1>
          <p>
            Post every version of your portfolio, collect real feedback and
            ratings from other developers, and climb the leaderboard.
          </p>
          <div className="flex gap-5 mt-5">
            <div className="w-1/2 p-5">
              <div className="flex items-center justify-center border-primary border-dashed border h-full">
                <div className="flex flex-col items-center">
                  <Image />
                  <h1>Screenshot</h1>
                  <p>
                    or <span className="underline">browse files</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center border border-primary p-5 border-dashed">
                  <h1>Screenshot</h1>
                  <p>
                    or <span className="underline">browse files</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center bg-primary p-5">
                <div className="flex flex-col items-center">
                  <h1 className="text-lg font-bold">9.4</h1>
                  <p className="text-sm">browse files</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-10 text-sm">
          <p>12,400+ developers</p>
          <p>38,000+ versions posted</p>
        </div>
      </div>
      <div className="flex items-center justify-center w-1/2">
        <div className="flex flex-col items-start gap-5">
          <div className="flex justify-center">
            <ButtonGroup>
              <Button className={"w-full"}>Sign In</Button>
              <Button variant={"outline"} className={"w-full"}>
                Sign Up
              </Button>
            </ButtonGroup>
          </div>
          <div>
            <h1 className="text-2xl text-center">Welcome back</h1>
            <p className="text-sm text-muted-foreground text-center">
              Sign in to keep shipping and collecting feedback.
            </p>
          </div>
          <div className="flex gap-2">
            <Button size={"lg"} className={"w-full"} variant={"outline"}>
              Google
            </Button>
            <Button size={"lg"} className={"w-full"} variant={"outline"}>
              Github
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="border-0.5 border-y w-full"></div>
            <p className="text-sm text-muted-foreground">or</p>
            <div className="border-0.5 border-y w-full"></div>
          </div>
          <div className="w-full">
            <p className="text-sm text-muted-foreground">Email</p>
            <Input />
          </div>

          <div className="w-full">
            <p className="text-sm text-muted-foreground">Password</p>
            <Input />
          </div>

          <Button className={"w-full"} onClick={() => router.push("/home")}>
            Sign In
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            By continuing you agree to the Terms & Community Guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
