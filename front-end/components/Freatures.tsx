"use client";
import {
  CrownIcon,
  GaugeIcon,
  HouseSimpleIcon,
  RobotIcon,
  StarFourIcon,
  StarHalfIcon,
  SwordIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { Button } from "./ui/button";

const Features = () => {
  const featureData = [
    {
      title: "AI Powered Reviews",
      description:
        "More than a portfolio showcase a competitive platform for feedback,discovery, growth, and recognition.",
      icon: RobotIcon,
    },

    {
      title: "Discover Top Creators",
      description:
        "Explore trending developers, designers, and creatives across multiple categories and styles.",
      icon: StarFourIcon,
    },

    {
      title: "Real Performance Analytics",
      description:
        "Track visitor behavior, feedback patterns, and growth metrics to continuously improve your portfolio.",
      icon: GaugeIcon,
    },

    {
      title: "Portfolio Battles",
      description:
        "Go head-to-head against other portfolios and let the community decide which one stands out.",
      icon: SwordIcon,
    },

    {
      title: "Global Leaderboards",
      description:
        "Compete with creators worldwide and climb rankings based on engagement, reviews, and portfolio quality.",
      icon: CrownIcon,
    },

    {
      title: "Public Ratings & Likes",
      description:
        "Explore trending developers, designers, and creatives across multiple categories and styles.",
      icon: StarHalfIcon,
    },
  ];
  return (
    <div id="features" className="my-40">
      <div className="flex gap-10">
        <div className="p-2 w-4/5">
          <h1 className="text-2xl">Everything your portfolio was missing.</h1>
          <p className="text-muted-foreground">
            Explore trending developers, designers, and creatives across
            multiple categories and styles.
          </p>
        </div>
        <div className="w-1/5">
          <Image src="/rmp2.png" alt="feature1" width={400} height={100} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-10">
        {featureData.map((f, index) => (
          <div
            className="border p-5 flex flex-col items-center gap-5"
            key={index}
          >
            <f.icon size={45} />
            <h1 className="text-lg">{f.title}</h1>
            <p className="text-center text-sm">{f.description}</p>
          </div>
        ))}

        <div className="border p-5 flex flex-col items-center gap-5">
          <HouseSimpleIcon size={45} />
          <h1 className="text-lg">And Many More...</h1>
          <Button>Get Started</Button>
        </div>
      </div>
    </div>
  );
};

export default Features;
