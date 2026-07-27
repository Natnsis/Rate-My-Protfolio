import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="h-[70vh] flex justify-center items-center">
      <div className="flex flex-col gap-5 items-center">
        <Badge variant={"secondary"}>Now with AI-powered roasts 🔥</Badge>
        <h1 className="text-6xl w-[60vw] text-center">
          Post your portfolio. Get brutally honest feedback.
        </h1>
        <p className="w-[40vw] text-center">
          Every version you ship becomes a post. Devs rate your UI, UX and code,
          drop comments, and vote you up the leaderboard.
        </p>
        <div className="flex gap-5">
          <Button size="lg" variant={"secondary"}>
            Post your first version
          </Button>
          <Button size="lg">Show how it works</Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
