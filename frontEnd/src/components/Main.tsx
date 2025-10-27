import { Button } from "@/components/ui/button";
import { Bookmark, MessageCircle, Share2, ThumbsUp } from "lucide-react";
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
import { useEffect, useState } from "react";
import {
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
  const fetchPosts = usePostStore((s) => s.fetchPosts);
  const getUsers = usePosterStore((s) => s.getUser);

  // Reaction store
  const { likes, toggleLike, getLikes } = useReactionStore();

  // Auth
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;

  const [postUsers, setPostUsers] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  /** Fetch posts + likes + their users */
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

        // attach users to each post
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

  /** UI states */
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
          if (!userId) return;
          try {
            await toggleLike(p.id, userId);
          } catch (err) {
            console.error("Failed to toggle like:", err);
          }
        };

        return (
          <div key={p.id} className="border p-5 rounded-lg">
            {/* user info */}
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

            {/* post description */}
            <p className="mb-3">{p.description}</p>

            {/* embedded project */}
            <div className="relative mb-3 rounded-lg overflow-hidden border">
              <iframe
                src={p.url}
                className="w-full h-[50vh] rounded-lg"
                sandbox=""
                loading="lazy"
              />
              <div className="absolute inset-0 bg-transparent pointer-events-auto" />
            </div>

            {/* actions */}
            <div className="flex justify-center gap-5 border-t pt-3 mt-3">
              <Button
                variant={isLiked ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={handleLike}
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

              {/* review dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="flex items-center gap-2">
                    <MessageCircle /> Review
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Write a review</DialogTitle>
                    <DialogDescription>
                      Write what you feel about the portfolio
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <Input
                      id="review"
                      name="review"
                      defaultValue="I LIKE IT! KEEP IT UP"
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Send</Button>
                  </DialogFooter>
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
