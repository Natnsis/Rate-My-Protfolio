import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/AuthStore";

type AlertType = "success" | "error" | null;

const Register = () => {
  // form state
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [image, setImage] = useState<null | File>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // alert state (shown on the form)
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const register = useAuthStore((s) => s.register);
  const storeError = useAuthStore((s) => s.error);

  // show store-level errors as form alert
  useEffect(() => {
    if (storeError) {
      showAlert(storeError, "error");
      useAuthStore.setState({ error: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeError]);

  const showAlert = (
    message: string,
    type: AlertType = "success",
    timeout = 5000
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setVisible(true);
    if (timeout > 0) {
      window.setTimeout(() => setVisible(false), timeout);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      showAlert("Please select an image", "error");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image);

    setIsLoading(true);
    try {
      const messageOrData = await register(formData);
      const message =
        typeof messageOrData === "string"
          ? messageOrData
          : messageOrData?.message || "Registered successfully";
      showAlert(message, "success");
      // reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setImage(null);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : "Registration failed");
      showAlert(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-screen w-screen bg-[url('/auth2.png')] bg-cover bg-center flex items-center justify-center">
      <div className="backdrop-blur-lg bg-black/40 border border-white/10 rounded-2xl p-10 sm:p-12 md:p-14 text-white shadow-2xl w-[90%] max-w-md">
        {/* Inline alert shown on the form */}
        {visible && alertType && (
          <div
            role="alert"
            className={`mb-4 px-4 py-3 rounded-md text-sm ${
              alertType === "success"
                ? "bg-green-600/90 text-white"
                : "bg-red-600/90 text-white"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>{alertMessage}</div>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setVisible(false)}
                className="opacity-90 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>
        )}

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
            disabled={isLoading}
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
