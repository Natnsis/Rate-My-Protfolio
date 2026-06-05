"use client";
import DesktopHeader from "@/components/DesktopHeader";
import Hero from "@/components/Hero";
import MobileHeader from "@/components/MobileHeader";

const App = () => {
  return (
    <div>
      <div className="hidden md:block">
        <DesktopHeader />
      </div>
      <div className="block md:hidden">
        <MobileHeader />
      </div>

      <div className="mt-0 lg:mt-20 md:mt-15"></div>
      <Hero />
    </div>
  );
};

export default App;

