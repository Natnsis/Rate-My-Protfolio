import Heading from "@/components/Heading";
import Main from "@/components/Main";
import RightSide from "@/components/RightSide";
import Sidebar from "@/components/Sidebar";

const Dashboard = () => {
  return (
    <section className="h-screen">
      <div className="sticky top-5 pb-5 ">
        <Heading page="home" />
      </div>
      <div className="grid grid-cols-4 p-5 px-20 h-full gap-8">
        <Sidebar />
        <main className="col-span-2 overflow-auto p-5 h-[85vh]">
          <Main />
        </main>
        <RightSide />
      </div>
    </section>
  );
};

export default Dashboard;
