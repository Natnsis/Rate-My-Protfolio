import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";

const DesktopHeader = () => {
  const router = useRouter();
  return (
    <header className="flex justify-between lg:px-5 px-5">
      <div className="flex gap-1 items-center">
        <Image src="/logo.png" width={50} height={50} alt="logo-img" />
        <h1 className="font-extrabold text-lg">FolioHub</h1>
      </div>
      <nav className="flex md:gap-5 items-center gap-1">
        <Button variant="link" onClick={() => router.push("/features")}>
          Features
        </Button>
        <Button variant="link" onClick={() => router.push("/social-media")}>
          Social Proof
        </Button>
        <Button variant="link" onClick={() => router.push("/social-media")}>
          Portfolio Battles
        </Button>
      </nav>
      <div className="flex md:gap-2 gap-0 items-center">
        <Button variant="outline">Check Demo</Button>
        <Button onClick={() => router.push("/login")}>Get Started</Button>
      </div>
    </header>
  );
};

export default DesktopHeader;
