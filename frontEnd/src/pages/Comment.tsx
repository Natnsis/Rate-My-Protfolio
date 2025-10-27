import Heading from "@/components/Heading";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/store/AuthStore";
import { useCommentStore } from "@/store/OtherStore";
import { useEffect } from "react";

const Comment = () => {
  const getComments = useCommentStore((s) => s.getComments);
  const comments = useCommentStore((s) => s.comments);
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;
  useEffect(() => {
    if (userId) getComments(userId);
  }, [getComments, userId]);
  const filteredComments = comments.filter((c) => c.id === userId);

  return (
    <section className="h-screen">
      <div className="sticky top-5 pb-5">
        <Heading page="message" />
      </div>

      <div className="grid grid-cols-4 p-5 px-20 h-full gap-8">
        <Sidebar />

        <main className="col-span-3 overflow-auto p-5 h-[85vh]">
          <h1 className="text-2xl font-bbh mb-5">Comments On Your Portfolio</h1>

          {filteredComments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            filteredComments.map((c) => (
              <div
                className="border border-border rounded-xl my-5 p-5 bg-muted/30 hover:bg-muted/40 transition-all"
                key={c.id}
              >
                <h1 className="font-semibold text-lg text-primary">
                  {c.userId}
                </h1>
                <p className="border-y border-border py-4 text-sm text-muted-foreground leading-relaxed mt-2">
                  {c.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </main>
      </div>
    </section>
  );
};

export default Comment;
