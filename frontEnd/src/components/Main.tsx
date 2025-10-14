import React from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import { Posts } from "@/constants/posts";
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

const Main = () => {
  return (
    <div>
      {Posts.map((p) => (
        <div className=" border-1 p-5 rounded-lg mb-5">
          <div>
            <div className="flex gap-5 items-center">
              <div>
                <img
                  src={p.image}
                  alt="tehe"
                  className="rounded-full w-12 h-12"
                />
              </div>
              <h1 className="font-bold text-xl">{p.name}</h1>
            </div>
          </div>
          <p className="pt-2">{p.content}</p>
          <div>
            <img src="auth.png" alt="poster" className="h-[50vh] w-full" />
          </div>
          <div className="mt-5 border-t-1 flex justify-between p-5">
            <Button variant="outline">
              <ThumbsUp /> Like
            </Button>
            <Button variant="outline">
              <Bookmark /> Save
            </Button>
            <Button variant="outline">
              <Share2 /> Visit
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link">
                  <Button>
                    <MessageCircle /> Review
                  </Button>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>write a review</DialogTitle>
                  <DialogDescription>
                    Write what you feel about the Portfolio
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Input
                      id="name-1"
                      name="name"
                      defaultValue="I LIKE IT!, KEEP IT UP"
                    />
                  </div>
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
