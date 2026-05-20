import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="p-5 border flex gap-10 items-center">
        <div>
          <Image
            src="/rmp2.png"
            alt="login-image"
            width={200}
            height={200}
            className="h-[60vh] w-[30vw]"
          />
        </div>

        <div className="w-[45vw] flex flex-col">
          <h1 className="text-4xl">Login Page</h1>
          <p className="text-muted-foreground">
            Add your credentials to get started
          </p>

          <form>
            <div className="flex flex-col">
              <label>Email</label>
              <input className="border-2" />
            </div>

            <div className="flex flex-col">
              <label>Password</label>
              <input className="border-2" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
