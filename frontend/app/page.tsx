import Demo from "@/components/Demo";
import DevCounts from "@/components/DevCounts";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

const page = () => {
  return (
    <div className="px-20">
      <Header />
      <Hero />
      <Demo />
      <DevCounts />
    </div>
  );
};

export default page;
