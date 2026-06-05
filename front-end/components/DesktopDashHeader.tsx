import { Plus, StepForward } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const DesktopDashHeader = () => {
  return (
    <div>
      <header className="flex justify-between">
        <Input className="w-1/2" placeholder="Search..." />
        <Button>
          <Plus />
          <h1>Create New Post</h1>
        </Button>
      </header>
      <div className="mt-5 flex justify-between">
        <h1>New Users</h1>
        <Button variant="ghost">
          <h1>Check All</h1>
          <StepForward />
        </Button>
      </div>
    </div>
  );
};

export default DesktopDashHeader;
