import { Button } from "@/components/ui/button";
import {
  BarricadeIcon,
  FolderDashedIcon,
  HouseSimpleIcon,
  StarIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
const Sidebar = () => {
  return (
    <div className="border-r h-full p-3">
      <div className="flex gap-5">
        <Image
          src="/rmp.png"
          width={50}
          height={50}
          alt="logo-img"
          className="h-10 w-10"
        />
        <h1 className="text-lg">FolioHub</h1>
      </div>

      <div className="mt-10">
        <div className="flex justify-center">
          <div className="border-2 rounded-full p-4 w-fit">
            <Image
              src="/profile.png"
              width={50}
              height={50}
              alt="logo-img"
              className="h-13 w-13"
            />
          </div>
        </div>
        <h1 className="text-center">Vera cherry</h1>
        <p className="text-center text-muted-foreground text-sm">
          Berman Germany
        </p>
      </div>

      <div className="flex justify-between mt-10 gap-3">
        <div>
          <h1 className="text-center">578</h1>
          <p>POSTS</p>
        </div>
        <div>
          <h1 className="text-center">37.2k</h1>
          <p>FOLLOWERS</p>
        </div>
        <div>
          <h1 className="text-center">999</h1>
          <p>FOLLOWING</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-10 justify-between">
        <div>
          <Link href="/feed" className="flex items-center gap-4">
            <HouseSimpleIcon size={25} />
            <h1 className="text-lg">Feed</h1>
          </Link>

          <Link href="/feed" className="flex items-center gap-4">
            <FolderDashedIcon size={25} />
            <h1 className="text-lg">Explore</h1>
          </Link>

          <Link href="/feed" className="flex items-center gap-4">
            <StarIcon size={25} />
            <h1 className="text-lg">My Favorite</h1>
          </Link>

          <Link href="/feed" className="flex items-center gap-4">
            <BarricadeIcon size={25} />
            <h1 className="text-lg">Stats</h1>
          </Link>
        </div>

        <div>
          <Button className="w-full">
            <BarricadeIcon size={25} />
            <h1 className="text-lg">Logout</h1>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
