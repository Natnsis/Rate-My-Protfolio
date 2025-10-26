// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Bookmark, MessageCircle, Share2, ThumbsUp } from "lucide-react";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "./ui/input";
// import { usePostStore } from "@/store/OtherStore";
// import { useUserStore } from "@/store/UserStore";

// interface User {
//   id: string;
//   name: string;
//   avatar: string;
// }

// const Main = () => {
//   const fetchPosts = usePostStore((s) => s.fetchPosts);
//   const posts = usePostStore((s) => s.posts) || [];

//   const getUser = useUserStore((s) => s.getUser);

//   const [users, setUsers] = useState<Record<string, User>>({});

//   // Fetch posts on mount
//   useEffect(() => {
//     fetchPosts();
//   }, [fetchPosts]);

//   // Fetch users for all posts
//   useEffect(() => {
//     const fetchAllUsers = async () => {
//       const userData: Record<string, User> = {};
//       for (const post of posts) {
//         if (!users[post.userId]) {
//           const user = await getUser(post.userId);
//           userData[post.userId] = user;
//         }
//       }
//       setUsers((prev) => ({ ...prev, ...userData }));
//     };

//     if (posts.length) fetchAllUsers();
//   }, [posts, getUser, users]);

//   return (
//     <div className="space-y-5">
//       {posts.map((post) => {
//         const user = users[post.userId];
//         return (
//           <div key={post.id} className="border p-5 rounded-lg">
//             {/* User info */}
//             <div className="flex items-center gap-4 mb-3">
//               <img
//                 src={user?.avatar || "/default-avatar.png"}
//                 alt={user?.name || "user"}
//                 className="w-12 h-12 rounded-full object-cover"
//               />
//               <h1 className="font-bold text-lg">
//                 {user?.name || "Loading..."}
//               </h1>
//             </div>

//             {/* Post content */}
//             <p className="mb-3">{post.description}</p>
//             <div className="mb-3">
//               <img
//                 src={post.url}
//                 alt="portfolio"
//                 className="w-full max-h-[50vh] object-contain rounded-lg border"
//                 onError={(e) => {
//                   e.currentTarget.src = "/default-portfolio.png";
//                 }}
//               />
//             </div>

//             {/* Action buttons */}
//             <div className="flex justify-between border-t pt-3 mt-3">
//               <Button variant="outline" className="flex items-center gap-2">
//                 <ThumbsUp /> Like
//               </Button>
//               <Button variant="outline" className="flex items-center gap-2">
//                 <Bookmark /> Save
//               </Button>
//               <Button variant="outline" className="flex items-center gap-2">
//                 <Share2 /> Visit
//               </Button>
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <Button variant="link" className="flex items-center gap-2">
//                     <MessageCircle /> Review
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-[425px]">
//                   <DialogHeader>
//                     <DialogTitle>Write a review</DialogTitle>
//                     <DialogDescription>
//                       Write what you feel about the portfolio
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="grid gap-4">
//                     <Input
//                       id="review"
//                       name="review"
//                       defaultValue="I LIKE IT! KEEP IT UP"
//                     />
//                   </div>
//                   <DialogFooter>
//                     <DialogClose asChild>
//                       <Button variant="outline">Cancel</Button>
//                     </DialogClose>
//                     <Button type="submit">Send</Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Main;
const Main = () => {
  return <div>hello</div>;
};
export default Main;
