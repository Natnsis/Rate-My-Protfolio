import { Button } from "./ui/button";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="py-15 flex flex-col items-center justify-center gap-5">
      <p>Rate. Improve. Climb.</p>
      <h1 className="text-6xl w-2/3 text-center">
        Post your portfolio. Watch the internet judge it.
      </h1>
      <p>
        Get likes, comments, rankings, AI roasts, and instant feedback from
        creators worldwide.
      </p>
      <div className="flex gap-5 mt-10">
        <Button className="p-5 rounded-full"> Explore Leaderboard</Button>
        <Button className="p-5 rounded-full" variant="outline">
          Upload Portfolio
        </Button>
      </div>
      <div className="mt-10">
        <Image src="/rmp.png" alt="Portfolio" width={1000} height={1000} />
      </div>
    </div>
  );
};

export default Hero;
