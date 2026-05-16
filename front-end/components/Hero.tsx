import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="flex flex-col gap-5 py-20 items-center">
      <h1 className="text-center text-6xl w-1/2">
        AI-Driven Conversation Growth Right Away
      </h1>
      <p className="text-lg w-2/3 text-center">
        From concept to conversion - manage thousands of successful influencers
        ads seamlessly
      </p>
      <div className="flex justify-center gap-5">
        <Button>Download Free App</Button>
        <Button variant="outline">Get Started Free</Button>
      </div>
    </div>
  );
};

export default Hero;
