import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <section className="h-screen w-screen bg-[url('/auth2.png')] bg-cover bg-center flex items-center justify-center">
      <div className="backdrop-blur-lg bg-black/40 border border-white/10 rounded-2xl p-10 sm:p-12 md:p-14 text-white shadow-2xl w-[90%] max-w-md">
        <div className="flex flex-col gap-5">
          <h1 className="text-center font-bbh text-4xl font-semibold mb-2">
            Create Account
          </h1>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus-visible:ring-white/30"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus-visible:ring-white/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              placeholder="example@gmail.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus-visible:ring-white/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus-visible:ring-white/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="profile" className="text-sm font-medium">
              Profile Image
            </Label>
            <Input
              id="profile"
              type="file"
              accept="image/*"
              className="bg-white/10 border-white/20 text-white file:text-white file:bg-white/20 file:border-none file:rounded-md file:px-3 file:py-1 file:cursor-pointer hover:file:bg-white/30"
            />
          </div>

          <Button
            variant="default"
            className="mt-4 bg-white text-black hover:bg-gray-100 font-semibold"
          >
            Register
          </Button>
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
