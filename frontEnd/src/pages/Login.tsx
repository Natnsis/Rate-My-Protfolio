import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <section className="h-screen w-screen bg-[url('/auth.png')] bg-cover bg-center flex items-center justify-center">
      <div className="backdrop-blur-lg bg-black/40 border border-white/10 rounded-2xl p-10 sm:p-12 md:p-14 text-white shadow-2xl w-[90%] max-w-md">
        <div className="flex flex-col gap-5">
          <h1 className="text-center font-bbh text-4xl font-semibold mb-2">
            Welcome Back!
          </h1>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </Label>
            <Input
              id="email"
              placeholder="example@gmail.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus-visible:ring-white/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-white"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus-visible:ring-white/30"
            />
          </div>

          <Button
            variant="default"
            className="mt-4 bg-white text-black hover:bg-gray-100 font-semibold"
          >
            Login
          </Button>
          <p className="text-center">
            Don't have an account yet?{" "}
            <Link to="/register" className="text-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
