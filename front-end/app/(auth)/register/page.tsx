"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[80%] lg:w-fit">
        <div className="flex rounded-lg">
          <div className="lg:flex items-center justify-center p-10 hidden">
            <Image
              src="/rmp.png"
              width={100}
              height={100}
              alt="login-img"
              className="h-[40vh] w-[60vw]"
            />
          </div>
          <div className="flex items-center justify-center w-full p-5">
            <div className="flex flex-col gap-3 w-[80%]">
              <div className="flex justify-center">
                <div className="flex  items-center">
                  <Image
                    src="/logo.png"
                    width={50}
                    height={50}
                    alt="logo-img"
                  />
                  <h1 className="font-extrabold text-lg">FolioHub</h1>
                </div>
              </div>
              <div>
                <p className="text-center">
                  SignIn to your account to continue
                </p>
              </div>
              <div className="flex w-full gap-5 mt-5">
                <div className="w-full">
                  <p>First Name</p>
                  <Input type="text" placeholder="John" />
                </div>

                <div className="w-full">
                  <p>Last Name</p>
                  <Input type="text" placeholder="Doe" />
                </div>
              </div>
              <div>
                <p>Email</p>
                <Input type="text" placeholder="name@exmple.com" />
              </div>

              <div>
                <p>Password</p>
                <Input type="text" placeholder="*******" />
              </div>
              <Button onClick={() => router.push("/dashboard")}>Sign Up</Button>
              <div className="relative flex items-center py-5">
                <div className="grow border-t border-muted-foreground"></div>
                <span className="shrink mx-4 text-muted-foreground text-xs uppercase font-extralight">
                  Or continue with
                </span>
                <div className="grow border-t border-muted-foreground"></div>
              </div>
              <Button variant="outline" className="font-bold">
                Google
              </Button>
              <div className="flex items-center justify-center">
                <p>Don&apos;t have an account? </p>
                <Button variant="link" onClick={() => router.push("/login")}>
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default page;
