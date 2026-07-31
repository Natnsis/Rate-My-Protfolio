import Topbar from "@/components/Topbar";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="p-5">
      <Topbar />
      {children}
    </div>
  );
};

export default layout;
