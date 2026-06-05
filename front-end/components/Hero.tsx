import { Button } from "./ui/button";
import Image from "next/image";

const Hero = () => {
  return (
    <div>
      <div className="flex justify-center items-center my-15 md:my-5 sm:my-3">
        <div className="flex flex-col items-center gap-5">
          <p className="text-lg font-semibold">Rate. Improve. Climb</p>
          <h1 className="lg:text-7xl text-5xl lg:w-[60vw] w-[90vw] md:w-[80vw] text-center">
            Post Your Portfolio. Watch The Internet Judge It.
          </h1>
          <h1 className="text-center lg:w-[50vw] w-[70vw] md:w-[60vw]">
            Get likes, Comments, Rankings, Ai roasts and instant feedback from
            creators world wide.
          </h1>
          <div className="flex gap-5">
            <Button variant="outline">Explore Leaderboard</Button>
            <Button>Upload Portfolio</Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center lg:mt-20">
        <Image
          alt="landing-img"
          src="/rmp.png"
          width={100}
          height={100}
          className="h-[80vh] lg:w-[50vw] w-[80vw]"
        />
      </div>
    </div>
  );
};

export default Hero;
