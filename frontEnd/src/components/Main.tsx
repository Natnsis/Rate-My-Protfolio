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
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { usePostStore, usePosterStore } from "@/store/OtherStore";

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
  user: User;
};

const Main = () => {
  const fetchPosts = usePostStore((s) => s.fetchPosts);
  const getUsers = usePosterStore((s) => s.getUser);
  const [postUsers, setPostUsers] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPosts();
        const fetchedPosts = usePostStore.getState().posts;

        if (!fetchedPosts || fetchedPosts.length === 0) {
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
  }, [fetchPosts, getUsers]);

  if (loading)
    return <p className="text-center text-gray-500">Loading posts...</p>;
  if (postUsers.length === 0)
    return <p className="text-center text-gray-500">No posts available</p>;

  console.log(postUsers);

  return (
    <div className="space-y-5">
      {postUsers.map((p) => (
        <div key={p.id} className="border p-5 rounded-lg">
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

          <p className="mb-3">{p.description}</p>

          <div className="relative mb-3 rounded-lg overflow-hidden border">
            <iframe
              src={p.url}
              className="w-full h-[50vh] rounded-lg"
              sandbox=""
              loading="lazy"
            />
            <div className="absolute inset-0 bg-transparent pointer-events-auto" />
          </div>

          <div className="flex justify-between border-t pt-3 mt-3">
            <Button variant="outline" className="flex items-center gap-2">
              <ThumbsUp /> Like
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Bookmark /> Save
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.open(p.url, "_blank")}
            >
              <Share2 /> Visit
            </Button>

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
      ))}
    </div>
  );
};

export default Main;
