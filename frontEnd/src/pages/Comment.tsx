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

  // Fetch comments for the current user
  useEffect(() => {
    if (userId) getComments(userId);
  }, [getComments, userId]);

  // Filter comments for the current user
  const filteredComments = comments.filter((c) => c.userId === userId);

  return (
    <section className="h-screen">
      {/* Heading */}
      <div className="sticky top-5 pb-5 z-10 bg-white/0">
        <Heading page="message" />
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 p-5 md:px-20 h-full gap-8">
        {/* Sidebar hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="col-span-1 md:col-span-3 overflow-auto p-5 h-[85vh]">
          <h1 className="text-2xl font-bbh mb-5 text-center md:text-left">
            Comments On Your Portfolio
          </h1>

          {filteredComments.length === 0 ? (
            <p className="text-gray-500 text-center md:text-left">
              No comments yet.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {filteredComments.map((c) => (
                <div
                  className="border border-border rounded-xl p-5 bg-muted/30 hover:bg-muted/40 transition-all"
                  key={c.id}
                >
                  <h2 className="font-semibold text-lg text-primary truncate">
                    {c.userId}
                  </h2>
                  <p className="border-y border-border py-4 text-sm text-muted-foreground leading-relaxed mt-2">
                    {c.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default Comment;
