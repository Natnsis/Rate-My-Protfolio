import BentoComponents from "@/components/BentoComponents";
import DashHeader from "@/components/DashHeader";

const getSpan = (index: number) => {
  if (index % 7 === 0) return "md:col-span-2 md:row-span-2";
  if (index % 5 === 0) return "md:col-span-2";
  if (index % 3 === 0) return "md:row-span-2";

  return "md:col-span-1 md:row-span-1";
};

const page = () => {
  const items = [
    {
      title: "Hero Card",
    },
    {
      title: "Analytics",
    },
    {
      title: "Messages",
    },
    {
      title: "Activity Feed",
    },
    {
      title: "Statistics",
    },
    {
      title: "Team",
    },
    {
      title: "Settings",
    },
    {
      title: "Settings",
    },
    {
      title: "Settings",
    },
    {
      title: "Settings",
    },
    {
      title: "Settings",
    },
    {
      title: "Settings",
    },
  ];
  return (
    <div className="min-h-screen px-5">
      <div className="h-[20vh] sticky top-0 bg-background z-10">
        <DashHeader />
      </div>
      <div className="mt-5">
        <BentoComponents data={items} />
      </div>
    </div>
  );
};

export default page;
