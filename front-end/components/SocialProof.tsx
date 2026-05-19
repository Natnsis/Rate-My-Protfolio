import ProofCard from "./ProofCard";

const SocialProof = () => {
  const proofs = [
    {
      description:
        "We were struggling to convert enterprise leads for months. After getting our portfolio and landing page reviewed by the platform, we implemented the suggested UX fixes. Within 45 days, our MRR tripled, and we closed two major contract accounts that completely changed our trajectory.",
      name: "Alex Rivera",
      role: "Founder & CEO, Pitt AI",
    },
    {
      description:
        "As a solo developer, design was always my weak point. The teardown feedback I received was incredibly specific—down to padding, typography hierarchy, and call-to-action placement. Launching the revamped version got us featured on Product Hunt, driving over 5,000 new sign-ups in a week.",
      name: "Sarah Chen",
      role: "Independent Indie Hacker",
    },
    {
      description:
        "The insight we got here was worth tenfold what we paid. The reviewers didn't just tell us what looked bad; they explained *why* our current user flow was causing 40% cart abandonment. Our conversion rate jumped from 1.8% to 5.2% in less than a month.",
      name: "Marcus Vance",
      role: "Head of Product at DevStream",
    },
    {
      description:
        "I was skeptical at first, but the portfolio review completely reshaped how we present our case studies to potential VCs. It helped us tell a cohesive story instead of just dumping code snippets and screenshots. We just closed our seed round!",
      name: "Elena Rostova",
      role: "Co-Founder, Nephos Security",
    },
  ];
  return (
    <div id="social-proof">
      <div className="flex justify-center">
        <h1 className="text-5xl w-[35vw] text-center">
          Trusted By Founders Backed By Results
        </h1>
      </div>
      <div className="px-5 grid grid-cols-4 gap-5 mt-15">
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
