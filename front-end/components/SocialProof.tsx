import ProofCard from "./ProofCard";

const SocialProof = () => {
  const proofs = [
    {
      description:
        "We had 3x our MRR in 45 days after getting our portfolio reviewed by the platform",
      name: "John Doe",
      role: "Founder of Pitt",
    },
    {
      description:
        "We had 3x our MRR in 45 days after getting our portfolio reviewed by the platform",
      name: "John Doe",
      role: "Founder of Pitt",
    },
    {
      description:
        "We had 3x our MRR in 45 days after getting our portfolio reviewed by the platform",
      name: "John Doe",
      role: "Founder of Pitt",
    },
  ];
  return (
    <div id="social-proof">
      <div className="flex justify-center">
        <h1 className="text-5xl w-[35vw] text-center">
          Trusted By Founders Backed By Results
        </h1>
      </div>
      <div className="px-5 grid grid-cols-4 gap-5 mt-5">
        {proofs.map((proof, index) => (
          <ProofCard
            key={index}
            description={proof.description}
            name={proof.name}
            role={proof.role}
          />
        ))}
      </div>
    </div>
  );
};

export default SocialProof;
