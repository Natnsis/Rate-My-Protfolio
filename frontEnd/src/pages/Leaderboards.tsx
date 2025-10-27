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
      <div className="sticky top-5 pb-5">
        <Heading page="leaderboards" />
      </div>
      <div className="grid grid-cols-4 p-5 px-20 h-full gap-8">
        <Sidebar />
        <main className="col-span-3 overflow-auto p-5 h-[85vh]">
          <h1 className="font-bbh text-3xl">
            <span className="text-primary">Top 10</span> Ranking Portfolios
          </h1>

          <div className="flex flex-wrap gap-4 mt-10 w-full font-quintessential">
            {topPortfolios.map((p, index) => (
              <div
                key={p.id}
                className="rounded-lg border p-3 flex flex-col gap-2 relative"
              >
                {/* Frozen iframe as an image */}
                <iframe
                  src={p.url}
                  className="w-40 h-40 pointer-events-none"
                  sandbox=""
                  loading="lazy"
                />

                <h1>
                  {p.user
                    ? `${p.user.firstName} ${p.user.lastName}`
                    : "Unknown"}
                </h1>

                <p className="flex items-center gap-1 text-sm">
                  <Heart className="text-red-500" /> {p.likeCount}
                </p>

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
