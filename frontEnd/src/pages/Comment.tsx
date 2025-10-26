import Heading from "@/components/Heading";
import Sidebar from "@/components/Sidebar";
import { Comments } from "@/constants/comments";

const Comment = () => {
  return (
    <section className="h-screen">
      <div className="sticky top-5 pb-5 ">
        <Heading page="message" />
      </div>
      <div className="grid grid-cols-4 p-5 px-20 h-full gap-8 ">
        <Sidebar />
        <main className="col-span-3 overflow-auto p-5 h-[85vh]">
          <div>
            <h1 className="text-2xl font-bbh">Comments On Your Portfolio </h1>
            {Comments.map((c, index) => (
              <div
                className="border border-border rounded-xl my-5 p-5 bg-muted/30 hover:bg-muted/40 transition-all"
                key={index}
              >
                <h1 className="font-semibold text-lg text-primary">{c.name}</h1>
                <p className="border-y border-border py-4 text-sm text-muted-foreground leading-relaxed mt-2">
                  {c.comment}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
};

export default Comment;
