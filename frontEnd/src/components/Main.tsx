import { Button } from "@/components/ui/button";
import { MessageCircle, Share2, ThumbsUp } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState, type FormEvent } from "react";
import {
  useCommentStore,
  usePostStore,
  usePosterStore,
  useReactionStore,
} from "@/store/OtherStore";
import { useAuthStore } from "@/store/AuthStore";

type User = {
  id: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
};

type Post = {
  id: string;
  userId: string;
  description: string;
  createdAt: Date;
  url: string;
  user: User | null;
};

const Main = () => {
  const [commentText, setCommentText] = useState("");
  const postComments = useCommentStore((s) => s.sendComments);

  const fetchPosts = usePostStore((s) => s.fetchPosts);
  const getUsers = usePosterStore((s) => s.getUser);
  const { likes, toggleLike, getLikes } = useReactionStore();

  const user = useAuthStore((s) => s.user);
  const userId = user?.id;

  const [postUsers, setPostUsers] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPosts();
        await getLikes();

        const fetchedPosts = usePostStore.getState().posts || [];

        if (fetchedPosts.length === 0) {
          setPostUsers([]);
          return;
        }

        const postsWithUsers = await Promise.all(
          fetchedPosts.map(async (p) => {
            const user = await getUsers(p.userId);
            return { ...p, user };
          })
        );

        setPostUsers(postsWithUsers);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchPosts, getUsers, getLikes]);

  if (loading)
    return <p className="text-center text-gray-500">Loading posts...</p>;

  if (postUsers.length === 0)
    return <p className="text-center text-gray-500">No posts available</p>;

  return (
    <div className="space-y-5">
      {postUsers.map((p) => {
        const isLiked = likes.some(
          (like) => like.userId === userId && like.portfolioId === p.id
        );

        const handleLike = async () => {
          if (!userId) {
            alert("Please log in to like posts.");
            return;
          }
          try {
            await toggleLike(p.id, userId);
          } catch (err) {
            console.error("Failed to toggle like:", err);
          }
        };

        const handleSendComment = async (
          e: FormEvent,
          closeDialog: () => void
        ) => {
          e.preventDefault();
          if (!userId) return alert("Please log in to comment.");
          if (!commentText.trim()) return;

          try {
            await postComments(p.id, {
              content: commentText,
              userId,
              receiverId: p.userId,
            });
            setCommentText("");
            alert("Comment sent successfully!");
            closeDialog();
          } catch (err) {
            console.error("Failed to send comment:", err);
            alert("Failed to send comment.");
          }
        };

        return (
          <div key={p.id} className="border p-5 rounded-lg shadow-sm">
            {/* User Info */}
            <div className="flex items-center gap-4 mb-3">
              <img
                src={p.user?.avatarUrl || "/default-avatar.png"}
                alt={p.user?.firstName || "user"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <h1 className="font-bold text-lg">
                {p.user
                  ? `${p.user.firstName} ${p.user.lastName}`
                  : "Unknown User"}
              </h1>
            </div>

            {/* Post Description */}
            <p className="mb-3">{p.description}</p>

            {/* Embedded Project */}
            <div className="relative mb-3 rounded-lg overflow-hidden border">
              <iframe
                src={p.url}
                className="w-full h-[50vh] rounded-lg"
                sandbox=""
                loading="lazy"
              />
              <div className="absolute inset-0 bg-transparent pointer-events-auto" />
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-5 border-t pt-3 mt-3">
              <Button
                variant={isLiked ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={handleLike}
                disabled={!userId}
              >
                <ThumbsUp />
                {isLiked ? "Liked" : "Like"}
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.open(p.url, "_blank")}
              >
                <Share2 /> Visit
              </Button>

              {/* Comment Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="flex items-center gap-2">
                    <MessageCircle /> Comment
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Write a comment</DialogTitle>
                    <DialogDescription>
                      Share what you think about this portfolio.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogClose asChild>
                    <form
                      onSubmit={(e) => handleSendComment(e, () => {})}
                      className="grid gap-4"
                    >
                      <Input
                        id="review"
                        name="review"
                        placeholder="I LIKE IT! KEEP IT UP"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          onClick={(e) => handleSendComment(e, () => {})}
                        >
                          Send
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Main;
