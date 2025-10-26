import Heading from "@/components/Heading";
import Sidebar from "@/components/Sidebar";

const Ai = () => (
  <section className="h-screen">
    <div className="sticky top-5 pb-5 ">
      <Heading page="ai" />
    </div>
    <div className="grid grid-cols-4 p-5 px-20 h-full gap-8 ">
      <Sidebar />
      <main className="col-span-2 overflow-auto p-5 h-[85vh]"></main>
    </div>
  </section>
);

export default Ai;
