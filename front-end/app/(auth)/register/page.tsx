import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoogleLogo } from "@phosphor-icons/react/dist/ssr";

const Page = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-xl ring-1 ring-foreground/5">
        {/* Left - Form */}
        <div className="flex w-full flex-col justify-center p-8 md:w-1/2">
          <div className="mx-auto w-full max-w-sm space-y-6">
            {/* Header */}
            <div className="space-y-1.5">
              <h1 className="text-2xl font-heading font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details to get started
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-sm font-medium"
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <Button type="submit" className="w-full">
                Create account
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google */}
            <Button
              variant="outline"
              className="w-full gap-2"
            >
              <GoogleLogo className="size-4" weight="bold" />
              Google
            </Button>

            {/* Login link */}
            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right - Image */}
        <div className="relative hidden w-1/2 overflow-hidden bg-muted md:flex">
          <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 to-transparent" />
          <Image
            src="/rmp2.png"
            alt="Register illustration"
            width={400}
            height={400}
            className="h-full w-full object-contain p-8"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
