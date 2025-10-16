import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";

const Register = () => {
  //form handling
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [image, setImage] = useState<null | File>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = async (e) => {
    if (!image) {
      alert("please select an image");
    }
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image!);

    const response = await axios.post(
      "http://localhost:3000/api/v1/register",
      formData,
      { headers: { "Context-type": "multipart/form-data" } }
    );

    console.log(response);
    setIsLoading(false);
  };

  return (
    <section className="h-screen w-screen bg-[url('/auth2.png')] bg-cover bg-center flex items-center justify-center">
      <div className="backdrop-blur-lg bg-black/40 border border-white/10 rounded-2xl p-10 sm:p-12 md:p-14 text-white shadow-2xl w-[90%] max-w-md">
        <form className="flex flex-col gap-5" onSubmit={handleRegister}>
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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
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
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
              className="bg-white/10 border-white/20 text-white file:text-white file:bg-white/20 file:border-none file:rounded-md file:px-3 file:py-1 file:cursor-pointer hover:file:bg-white/30"
            />
          </div>

          <Button
            variant="default"
            className="mt-4 bg-white text-black hover:bg-gray-100 font-semibold"
          >
            {isLoading ? (
              <span className="flex gap-2 text-gray-400">
                <Spinner />
                Registering
              </span>
            ) : (
              "Register"
            )}
          </Button>
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
