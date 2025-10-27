import { useState } from "react";
import { Button } from "./components/ui/button";
import {
  ArrowUp,
  HandCoins,
  Linkedin,
  Send,
  Star,
  Menu,
  X,
} from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const login = () => navigate("/login");
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const LINKS = {
    github: "https://github.com/Natnsis/Rate-My-Protfolio",
    telegram: "https://t.me/bugpusher",
    linkedin: "https://linkedin.com/in/natnael-sisay",
  };

  const openLink = (url) => window.open(url, "_blank", "noopener,noreferrer");
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section id="home" className="pt-5 px-5 md:px-20">
      {/* HEADER */}
      <header className="flex justify-between items-center border-b pb-5 relative">
        <h1 className="font-quintessential text-3xl md:text-4xl cursor-pointer">
          R.<span className="text-primary">M</span>.P
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-5 items-center">
          <ModeToggle />

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => openLink(LINKS.github)}
          >
            <Star size={18} /> Give Star
          </Button>

          <Button
            className="flex items-center gap-2"
            onClick={() => openLink(LINKS.telegram)}
          >
            <Send size={18} /> Telegram
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg hover:bg-accent transition"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-card border-t shadow-lg flex flex-col items-center py-5 gap-4 z-50 md:hidden animate-in slide-in-from-top">
            <ModeToggle />

            <Button
              variant="outline"
              className="w-3/4 flex items-center justify-center gap-2"
              onClick={() => openLink(LINKS.linkedin)}
            >
              <Linkedin size={18} /> LinkedIn
            </Button>

            <Button
              className="w-3/4 flex items-center justify-center gap-2"
              onClick={() => openLink(LINKS.telegram)}
            >
              <Send size={18} /> Telegram
            </Button>

            <Button
              variant="outline"
              className="w-3/4 flex items-center justify-center gap-2"
              onClick={() => openLink(LINKS.github)}
            >
              <Star size={18} /> GitHub
            </Button>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <main className="px-3 md:px-5">
        <div className="flex flex-col md:flex-row gap-5 py-5 items-center">
          <div className="text-center md:text-left">
            <p className="text-4xl md:text-6xl font-poppins uppercase">
              Get Into The Zone
            </p>
          </div>
          <div className="w-full md:w-[45vw]">
            <p className="font-quintessential text-base md:text-lg text-center md:text-left">
              Show off your portfolio, get roasted (nicely), and rated by the
              crowd. Upload, rate others, and see who’s really got the best
              portfolio game.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-10 items-center">
          <img
            src="/hero.png"
            alt="hero"
            className="w-full md:w-[50%] rounded-lg h-auto max-h-[50vh] object-cover"
          />

          <div className="flex flex-col items-center w-full">
            <div className="w-full md:w-3/4 mt-6">
              <div className="border border-border rounded-xl p-4 flex flex-row justify-between items-center text-center gap-3 shadow-sm">
                <Stat title="Check" value="Review" />
                <Stat title="Like / Dis" value="Posts" />
                <Stat
                  title="Responses"
                  value={
                    <span className="inline-flex items-center justify-center text-xs font-semibold text-primary border border-primary px-2 py-1 rounded-lg">
                      AI
                    </span>
                  }
                />
              </div>
            </div>

            <Button
              className="mt-10 w-3/4 md:w-2/4 h-12 font-extrabold"
              onClick={login}
            >
              <HandCoins /> Get Started
            </Button>
          </div>
        </div>
      </main>

      {/* FEATURES */}
      <section id="features" className="mt-20 flex flex-col items-center gap-5">
        <h1 className="text-4xl md:text-6xl font-poppins uppercase mb-5">
          Features
        </h1>

        <div className="flex flex-col md:flex-row gap-5 w-full">
          <FeatureCard
            img="/rate.jpeg"
            title="Like & Comment"
            text="Give and receive honest feedback from peers and professionals."
          />
          <FeatureCard
            img="/insights.jpeg"
            title="Smart Insights"
            text="See how your portfolio performs across design, usability, and creativity."
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5 w-full">
          <FeatureCard
            img="/funny.jpeg"
            title="Funny Feedback"
            text="Drop witty comments of the AI that make people laugh and think."
          />
          <FeatureCard
            img="/leaderboards.png"
            title="Leaderboard"
            text="See who’s topping the charts (and who needs a redesign)."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mt-20 text-center">
        <h1 className="text-4xl md:text-6xl font-poppins uppercase mb-5">
          How It Works
        </h1>

        <div className="flex justify-center">
          <Carousel className="border rounded-lg p-5 w-full md:w-1/2">
            <CarouselContent>
              {[
                "Sign up and create your profile.",
                "Post your portfolio or link your site.",
                "Receive reactions from the community and track your rank.",
                "React to others for fun.",
              ].map((text, i) => (
                <CarouselItem key={i}>
                  <h1 className="text-4xl font-bbh mb-3">{i + 1}</h1>
                  <p className="font-quintessential text-lg">{text}</p>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-20 bg-card p-5 w-full rounded-t-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="md:w-1/3 text-center md:text-left">
            <h1 className="text-primary font-bbh text-2xl">R.M.P</h1>
            <p>
              AI-powered portfolio rating app built for creators who can handle
              the truth.
            </p>
          </div>

          <div className="flex gap-5">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={scrollToTop}
            >
              <ArrowUp /> Back To Top
            </Button>

            <Button
              variant="outline"
              onClick={() => openLink(LINKS.linkedin)}
              className="flex items-center gap-2"
            >
              <Send size={16} /> LinkedIn
            </Button>
          </div>
        </div>
        <p className="text-white text-center mt-5">R.M.P built with ❤️ 2025</p>
      </footer>
    </section>
  );
};

// Feature Card
const FeatureCard = ({ img, title, text }) => (
  <div className="border rounded-lg p-5 w-full flex flex-col md:flex-row gap-5 hover:shadow-md transition">
    <div className="w-full md:w-1/4">
      <img
        src={img}
        alt={title}
        className="w-full h-32 md:h-40 lg:h-48 rounded-lg object-cover"
      />
    </div>
    <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
      <h1 className="font-bbh text-2xl">{title}</h1>
      <p>{text}</p>
    </div>
  </div>
);

// Stats Component
const Stat = ({ title, value }) => (
  <div className="md:border-r px-3 md:px-6 text-center last:border-none">
    <h1 className="text-2xl md:text-3xl font-bold">{value}</h1>
    <p className="text-sm md:text-base">{title}</p>
  </div>
);

export default App;
