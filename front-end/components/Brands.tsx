import Image from "next/image";

const Brands = () => {
  return (
    <div>
      <div className="flex items-center justify-between gap-5 mx-20">
        <Image src="/rmp.png" alt="Portfolio" width={100} height={100} />
        <Image src="/rmp.png" alt="Portfolio" width={100} height={100} />
        <Image src="/rmp.png" alt="Portfolio" width={100} height={100} />
        <Image src="/rmp.png" alt="Portfolio" width={100} height={100} />
        <Image src="/rmp.png" alt="Portfolio" width={100} height={100} />
        <Image src="/rmp.png" alt="Portfolio" width={100} height={100} />
      </div>
    </div>
  );
};

export default Brands;
