import Demo from "@/components/Demo";
import DevCounts from "@/components/DevCounts";
import Features from "@/components/Features";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";

const page = () => {
  return (
    <div className="px-20">
      <Header />
      <Hero />
      <Demo />
      <DevCounts />
      <Features />
      <Testimonials />
    </div>
  );
};

export default page;
