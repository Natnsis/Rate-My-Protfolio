import Heading from "@/components/Heading";
import Sidebar from "@/components/Sidebar";
import {
  usePosterStore,
  usePostStore,
  useReactionStore,
} from "@/store/OtherStore";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

type Post = {
  id: string;
  userId: string;
  url: string;
  user?: User | null;
};

const Leaderboards = () => {
  const [topPortfolios, setTopPortfolios] = useState<
    (Post & { likeCount: number })[]
  >([]);

  // Reaction store
  const { likes, getLikes } = useReactionStore();

  // User store
  const { getUser } = usePosterStore();

  // Post store
  const { fetchPosts, posts } = usePostStore();

  // Fetch posts and likes
  useEffect(() => {
    const fetchData = async () => {
      await fetchPosts();
      await getLikes();
    };
    fetchData();
  }, [fetchPosts, getLikes]);

  // Attach users and calculate like counts
  useEffect(() => {
    const prepareLeaderboard = async () => {
      if (!posts || posts.length === 0) return;

      const postsWithUsers: Post[] = await Promise.all(
        posts.map(async (p) => {
          const user = await getUser(p.userId);
          return { ...p, user };
        })
      );

      const postsWithLikes = postsWithUsers.map((p) => ({
        ...p,
        likeCount: likes.filter((l) => l.portfolioId === p.id).length,
      }));

      // Sort descending by likes
      const sorted = postsWithLikes.sort((a, b) => b.likeCount - a.likeCount);

      setTopPortfolios(sorted.slice(0, 10));
    };

    prepareLeaderboard();
  }, [posts, likes, getUser]);

  return (
    <section className="h-screen">
      {/* Heading */}
      <div className="sticky top-5 pb-5 z-10 bg-white/0">
        <Heading page="leaderboards" />
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 p-5 md:px-20 h-full gap-8">
        {/* Sidebar hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="col-span-1 md:col-span-3 overflow-auto p-5 h-[85vh]">
          <h1 className="font-bbh text-3xl text-center md:text-left">
            <span className="text-primary">Top 10</span> Ranking Portfolios
          </h1>

          <div className="flex flex-wrap gap-4 mt-10 w-full font-quintessential justify-center md:justify-start">
            {topPortfolios.map((p, index) => (
              <div
                key={p.id}
                className="rounded-lg border p-3 flex flex-col gap-2 relative
                           w-[48%] sm:w-[45%] md:w-40"
              >
                {/* iframe preview */}
                <iframe
                  src={p.url}
                  className="w-full h-40 pointer-events-none"
                  sandbox=""
                  loading="lazy"
                />

                {/* User name */}
                <h1 className="truncate text-center md:text-left">
                  {p.user
                    ? `${p.user.firstName} ${p.user.lastName}`
                    : "Unknown"}
                </h1>

                {/* Likes */}
                <p className="flex items-center gap-1 text-sm justify-center md:justify-start">
                  <Heart className="text-red-500" /> {p.likeCount}
                </p>

                {/* Ranking index */}
                <p className="absolute top-2 right-2 text-primary font-bbh text-2xl">
                  {index + 1}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
};

export default Leaderboards;
