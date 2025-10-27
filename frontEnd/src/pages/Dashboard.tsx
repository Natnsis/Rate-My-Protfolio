import Heading from "@/components/Heading";
import Main from "@/components/Main";
import RightSide from "@/components/RightSide";
import Sidebar from "@/components/Sidebar";

const Dashboard = () => {
  return (
    <section className="h-screen">
      <div className="sticky top-5 pb-5">
        <Heading page="home" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-5 md:px-20 h-full">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="order-first md:order-none col-span-1 md:col-span-1">
          <RightSide />
        </div>

        <main className="order-last md:order-none col-span-1 md:col-span-2 overflow-auto p-5 h-[85vh]">
          <Main />
        </main>
      </div>
    </section>
  );
};

export default Dashboard;
