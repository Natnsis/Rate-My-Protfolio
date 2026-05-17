import Brands from "@/components/Brands";
import Features from "@/components/Freatures";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LiveTrending from "@/components/LiveTrending";
import PortfolioBattles from "@/components/PortfolioBattles";
import SocialProof from "@/components/SocialProof";

const page = () => {
  return (
    <div className="px-5 py-b h-screen overflow-y-auto">
      <Header />
      <Hero />
      <Brands />
      <Features />
      <SocialProof />
      <LiveTrending />
      <PortfolioBattles />
    </div>
  );
};

export default page;
