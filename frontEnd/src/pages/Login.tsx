import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/AuthStore";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await login({ email, password });
      setIsLoading(false);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <section className="h-screen w-screen bg-[url('/auth.png')] bg-cover bg-center flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="backdrop-blur-lg bg-black/40 border border-white/10 rounded-2xl p-10 sm:p-12 md:p-14 text-white shadow-2xl w-[90%] max-w-md"
      >
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
              onChange={(e) => setEmail(e.target.value)}
              value={email}
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
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus-visible:ring-white/30"
            />
          </div>

          {error && <p className="text-red-400 text-center text-sm">{error}</p>}

          <Button
            variant="default"
            className="mt-4 bg-white text-black hover:bg-gray-100 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex gap-2 text-gray-400">
                <Spinner />
                Logging In..
              </span>
            ) : (
              "Login"
            )}
          </Button>

          <p className="text-center">
            Don't have an account yet?{" "}
            <Link to="/register" className="text-primary font-semibold">
              Register
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default Login;
