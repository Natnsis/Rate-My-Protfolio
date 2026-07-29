import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

const Testimonials = () => {
  const testis = [
    {
      parags:
        "Got roasted on my v1 portfolio, rebuilt it, hit 9.2 on v3.The version history alone made me a better designer.",
      name: "Priya Nair",
      role: "Frontend Engineer",
    },
    {
      parags:
        "The structured ratings are the whole point. I don't need more likes, I need to know my UX score is lower than my UI score.",
      name: "Dan Ferreira",
      role: "Product Designer",
    },
    {
      parags:
        "Genuinely the only social app I open every day as a dev. The leaderboard makes shipping addictive.",
      name: "Kenji Watanabe",
      role: "Full-stack Developer",
    },
  ];

  return (
    <div className="mt-[15vh] flex justify-center">
      <div className="w-[70vw] flex flex-col">
        <h1 className="text-4xl text-center">What developers are saying</h1>
        <div className="flex justify-between gap-10 mt-10">
          {testis.map((t, index) => (
            <Card className="p-5" key={index}>
              <p>&apos;{t.parags}&apos;</p>
              <div className="flex gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h1>{t.name}</h1>
                  <p>{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
