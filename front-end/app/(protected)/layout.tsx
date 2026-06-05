import DesktopSidebar from "@/components/DesktopSidebar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full">
      <div className="w-[20%] px-5">
        <DesktopSidebar />
      </div>
      <div className="w-[75%]">{children}</div>
      <div className="w-[15%]">Trends</div>
    </div>
  );
};

export default ProtectedLayout;
