import DesktopHeader from "@/components/DesktopHeader";
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
    </div>
  );
};

export default App;

