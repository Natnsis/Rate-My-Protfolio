import Heading from "@/components/Heading";
import Main from "@/components/Main";
import RightSide from "@/components/RightSide";
import Sidebar from "@/components/Sidebar";

const Dashboard = () => {
  return (
    <section className="h-screen">
      <div className="sticky top-5 pb-5 z-10">
        <Heading page="home" />
      </div>
      <div className="h-[calc(100vh-80px)] p-5 md:px-10 lg:px-20">
        <div className="flex flex-col gap-8 lg:hidden">
          <RightSide />
          <Main />
        </div>
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-8 h-full">
          <div>
            <Sidebar />
          </div>
          <main className="col-span-2 flex justify-center h-full md:h-[80vh]">
            <div className="w-full max-w-2xl h-full overflow-auto py-4">
              <Main />
            </div>
          </main>
          <div>
            <RightSide />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
