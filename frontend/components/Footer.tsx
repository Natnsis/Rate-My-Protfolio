import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <div>
      <div className="flex justify-center py-5 mt-[10vh]">
        <div className="w-[70vw] rounded-xl flex justify-center items-center bg-secondary h-[40vh] p-5 text-white">
          <div className="flex flex-col items-center gap-5">
            <h1 className="text-5xl">Ready to see what devs really think?</h1>
            <p>Free to join. Post your first version in under two minutes.</p>
            <div className="flex justify-center">
              <Button size={"lg"}>Create your account</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center border-t py-5 mt-[10vh]">
        <div className="w-[70vw] flex justify-between items-center">
          <div className="flex gap-5 items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1>DevFolio</h1>
          </div>
          <p>&copy; 2026 DevFolio. Built by devs, for devs.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
