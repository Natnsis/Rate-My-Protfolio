import DashHeader from "@/components/DashHeader";

const page = () => {
  return (
    <div className="min-h-screen px-5">
      <div className="h-[20vh] sticky top-0 bg-background z-10">
        <DashHeader show={false} />
      </div>
      <div className="mt-5"></div>
    </div>
  );
};

export default page;
