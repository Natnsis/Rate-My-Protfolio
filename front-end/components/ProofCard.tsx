import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProofCard = ({
  description,
  name,
  role,
}: {
  description: string;
  name: string;
  role: string;
}) => {
  return (
    <div className="border-2 p-5">
      <p>&apos;&apos;{description}&apos;&apos;</p>
      <div className="flex gap-5 mt-5">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h1 className="text-sm">{name}</h1>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default ProofCard;
