import { Button } from "./components/ui/button";
import { ArrowUp, HandCoins, Linkedin, Send, Star } from "lucide-react";
import { ModeToggle } from "./components/ui/mode-toggle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./components/ui/carousel";
import { useNavigate } from "react-router-dom";
const App = () => {
  const navigate = useNavigate();
  const login = () => {
    navigate("/login");
  };
  return (
    <section className="pt-5 px-20">
      {/* heading */}
      <header className="flex justify-between border-b-1 pt-8 pb-5">
        <h1 className="font-quintessential text-4xl">
          R.<span className="text-primary">M</span>.P
        </h1>
        <nav className="gap-5 flex items-center">
          <ModeToggle />
          <div className="flex gap-5 mr-5 font-bold">
            <a href="#home" className="hover:underline">
              HOME
            </a>
            <a href="#about" className="hover:underline">
              ABOUT
            </a>
          </div>

          <Button variant="outline">
            <Linkedin />
            Linked In
          </Button>
          <Button>
            <Send />
            Telegram
          </Button>
        </nav>
      </header>

      {/* hero */}
      <main className="px-5  pt-10">
        <div className="flex gap-5 py-5">
          <div>
            <p className="text-6xl font-poppins uppercase">Get Real Feedback</p>
          </div>
          <div className="w-[45vw] flex ">
            <p className="font-quintessential text-lg w-full">
              Show off your portfolio, get roasted (nicely), and rated by the
              crowd. It’s where creativity meets comedy your work gets stars,
              laughs, and maybe a little ego check. Upload, rate others, and see
              who’s really got the best portfolio game.
            </p>
          </div>
        </div>
        <div>
          <p className="text-6xl font-poppins uppercase text-center">
            Have Fun & Level Up Your{" "}
            <span className="text-primary">Portfolio</span>.
          </p>
        </div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div>
              <img
                src="/hero.png"
                alt="hero"
                className="w-[50vw] rounded-lg h-[50vh]"
              />
            </div>
            <div className="flex flex-col items-center mt-10 w-full">
              <p className="text-6xl font-poppins uppercase text-center">
                Join The Fun
              </p>
              <div className="border-1 rounded-lg p-5 flex justify-between w-3/4 mt-5">
                <div className="border-r-1 px-10 pr-15">
                  <h1 className="text-3xl font-bold ">140</h1>
                  <p className="text-center">Users</p>
                </div>
                <div className="border-r-1 px-10 pr-15">
                  <h1 className="text-3xl font-bold ">120K</h1>
                  <p className="text-center">Reactions</p>
                </div>
                <div className="px-10 pr-15">
                  <h1 className="text-3xl font-bold flex items-center">
                    4.5
                    <Star />
                  </h1>
                  <p className="text-center">Rating</p>
                </div>
              </div>
              <div className="mt-10 w-full flex justify-center h-full">
                <Button className="w-2/4 h-15 font-extrabold" onClick={login}>
                  <HandCoins /> Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* features */}
      <div className="mt-20 flex flex-col justify-center items-center">
        <h1 className="text-6xl font-poppins uppercase text-center mb-5">
          Features
        </h1>
        <div className="w-full flex-col flex gap-5">
          {/* list one  */}
          <div className="flex gap-5 w-full">
            <div className="border-1 rounded-lg p-5 w-full flex gap-10">
              <div className="w-1/4 ">
                <img src="/rate.jpeg" className="rounded-lg" alt="like cat" />
              </div>
              <div className="flex flex-col justify-center items-center">
                <h1 className="font-bbh text-2xl">Rate & Review</h1>
                <p className="text-center">
                  Give and receive honest feedback from peers and professionals.
                </p>
              </div>
            </div>

            <div className="border-1 rounded-lg p-5 w-full flex gap-10">
              <div className="w-1/4 ">
                <img
                  src="/insights.jpeg"
                  className="rounded-lg"
                  alt="insight"
                />
              </div>
              <div className="flex flex-col justify-center items-center">
                <h1 className="font-bbh text-2xl">Smart Insights</h1>
                <p className="text-center">
                  See how your portfolio performs across design, usability, and
                  creativity.
                </p>
              </div>
            </div>
          </div>

          {/* list two */}
          <div className="flex gap-5 w-full">
            <div className="border-1 rounded-lg p-5 w-full flex gap-10">
              <div className="w-1/4 ">
                <img
                  src="/funny.jpeg"
                  className="rounded-lg w-3/4"
                  alt="funny"
                />
              </div>
              <div className="flex flex-col justify-center items-center">
                <h1 className="font-bbh text-2xl">Funny Feedback</h1>
                <p className="text-center">
                  Drop witty comments that make people laugh and think.
                </p>
              </div>
            </div>

            <div className="border-1 rounded-lg p-5 w-full flex gap-10">
              <div className="w-1/4 ">
                <img
                  src="/leaderboards.png"
                  className="rounded-lg"
                  alt="leaderboard"
                />
              </div>
              <div className="flex flex-col justify-center items-center">
                <h1 className="font-bbh text-2xl">Leaderboard</h1>
                <p className="text-center">
                  See who’s topping the charts (and who needs a redesign).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* how it works */}
      <div className="mt-20 text-center ">
        <h1 className="text-6xl font-poppins uppercase text-center mb-5">
          How It Works
        </h1>
        <div className="flex justify-center">
          <Carousel className="border-1 rounded-lg p-5 w-1/2 ">
            <CarouselContent>
              <CarouselItem>
                <h1 className="text-center text-4xl font-bbh">1</h1>
                <p className="font-quintessential text-xl">
                  Sign up and create your profile.
                </p>
              </CarouselItem>
              <CarouselItem>
                <h1 className="text-center text-4xl font-bbh">2</h1>
                <p className="font-quintessential text-xl">
                  Upload your portfolio or link your site.
                </p>
              </CarouselItem>
              <CarouselItem>
                <h1 className="text-center text-4xl font-bbh">3</h1>
                <p className="font-quintessential text-xl">
                  Receive ratings from the community and track your progress.
                </p>
              </CarouselItem>
              <CarouselItem>
                <h1 className="text-center text-4xl font-bbh">4</h1>
                <p className="font-quintessential text-xl">
                  Rate others to earn credibility points and badges.
                </p>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      {/*footer */}
      <footer className="mt-10 rounded-t-lg bg-card p-5 w-full">
        <div className="flex justify-between items-center">
          <div className="w-1/3">
            <h1 className="text-primary font-bbh text-2xl">R.M.P</h1>
            <p>
              AI powered Protfolio rating social media app,Built for creators
              who can handle the truth
            </p>
          </div>
          <div>
            <nav className="flex flex-col text-white">
              <a href="#home">Home</a>
              <a href="#home">Features</a>
              <a href="#home">How It Works</a>
            </nav>
          </div>
          <div className="flex flex-col gap-5">
            <Button variant="outline">
              <ArrowUp />
              Back To Top
            </Button>

            <Button variant="outline">Contact Us</Button>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default App;
