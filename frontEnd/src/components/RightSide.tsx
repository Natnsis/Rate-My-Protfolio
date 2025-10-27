import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePostStore } from "@/store/OtherStore";
import { useState } from "react";
import { useAuthStore } from "@/store/AuthStore";
import { Spinner } from "./ui/spinner";

const RightSide = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  const addPost = usePostStore((s) => s.addPosts);
  const { id } = useAuthStore((s) => s.user);
  const error = usePostStore((s) => s.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link || !description) {
      alert("Please provide both link and description.");
      return;
    }

    const data = { userId: id, url: link, description };
    setIsLoading(true);

    await addPost(data);

    setIsLoading(false);

    if (!error) {
      // Clear form
      setLink("");
      setDescription("");
      window.location.assign("https://rate-my-protfolio.vercel.app");
    }
  };

  return (
    <div className="col-span-1 pt-5">
      <div className="rounded border w-full p-3">
        <h1>Post Your Portfolio</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-5">
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Portfolio Link"
          />
          <Input
            value={description}
            placeholder="What do y'all think?"
            onChange={(e) => setDescription(e.target.value)}
            className="h-[20vh]"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="text-gray-200 flex items-center gap-2">
                <Spinner /> Posting...
              </span>
            ) : (
              "Post"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RightSide;
