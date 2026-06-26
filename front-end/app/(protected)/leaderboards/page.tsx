import DashHeader from "@/components/DashHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const page = () => {
  return (
    <div className="min-h-screen px-5">
      <DashHeader show={false} />
      <div className="mt-5">
        <div className="flex justify-center mt-5">
          <div className="flex gap-10 items-end">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="h-30 w-30">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div>this is comming through</div>
      </div>
    </div>
  );
};

export default page;
