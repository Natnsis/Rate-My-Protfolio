import { Card } from "./ui/card";

const getSpan = (index: number) => {
  if (index % 7 === 0) return "md:col-span-2 md:row-span-2";
  if (index % 5 === 0) return "md:col-span-2";
  if (index % 3 === 0) return "md:row-span-2";

  return "md:col-span-1 md:row-span-1";
};

const BentoComponents = ({ data }: { data: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-4">
      {data.map((item, index) => (
        <Card key={index} className={`p-6 ${getSpan(index)}`}>
          {item.title}
        </Card>
      ))}
    </div>
  );
};

export default BentoComponents;
