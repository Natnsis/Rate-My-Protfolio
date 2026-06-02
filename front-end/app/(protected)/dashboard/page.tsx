"use client";
import { HouseSimpleIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <div className="grid grid-cols-5 h-screen">
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

        <div className="flex flex-col gap-2 mt-10">
          <Link href="/feed" className="flex items-center">
            <HouseSimpleIcon />
            <h1>Feed</h1>
          </Link>
        </div>
      </div>

      <div className="col-span-3">heh</div>
      <div className="border-l h-full">hehe</div>
    </div>
  );
};

export default page;
