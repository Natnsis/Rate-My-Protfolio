import { Heading, Sidebar } from "lucide-react";
import React from "react";

const Comment = () => {
  return (
    <section className="h-screen">
      <div className="sticky top-5 bg-white">
        <Heading />
      </div>
      <div className="grid grid-cols-4 p-5 px-20 bg-gray-50 h-full gap-8">
        <Sidebar />
      </div>
    </section>
  );
};

export default Comment;
