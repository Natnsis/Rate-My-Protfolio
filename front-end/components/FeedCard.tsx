import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Bookmark,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Share,
} from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

const FeedCard = ({
  name,
  positon,
  likes,
  comments,
  shares,
  saves,
}: {
  name: string;
  positon: number;
  likes: number;
  shares: number;
  saves: number;
  comments: number;
}) => {
  return (
    <Card className="p-5">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1>Natnael Sisay</h1>
            <p>Frontend Dev</p>
          </div>
        </div>
        <Button variant="ghost">
          <MoreHorizontal />
        </Button>
      </div>
      <Image
        alt="feed-img"
        src="/feed.jpeg"
        width={900}
        height={400}
        className="w-full h-[45vh]"
      />
      <div className="flex justify-between">
        <Button variant="ghost">
          <Heart />
          <h1>24.34k likes</h1>
        </Button>
        <Button variant="ghost">
          <MessageSquare />
          <h1>3k comments</h1>
        </Button>
        <Button variant="ghost">
          <Share />
          <h1>1.2k shares</h1>
        </Button>
        <Button variant="ghost">
          <Bookmark />
          <h1>16 saved</h1>
        </Button>
      </div>
    </Card>
  );
};

export default FeedCard;
