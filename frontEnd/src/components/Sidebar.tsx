import { useAuthStore } from "@/store/AuthStore";
import { useUserStore } from "@/store/UserStore";
import { useEffect } from "react";

const Sidebar = () => {
  const authUser = useAuthStore((s) => s.user);
  const id = authUser?.id;
  const data = useUserStore((s) => s.user);
  const getUser = useUserStore((s) => s.getUser);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const fetched = await getUser(id);
        console.log("fetched user:", fetched);
      } catch (err) {
        console.error("getUser failed in Sidebar:", err);
      }
    })();
  }, [id]);

  return (
    <div className="col-span-1 h-full gap-5 border-r-1 pr-5">
      <div className="w-full mt-10 rounded-lg p-5 border-1">
        <img
          src={data?.avatarUrl ?? "/auth.png"}
          alt={data?.firstName ?? "profile"}
          className="w-15 h-15 rounded-full border-2 "
        />
        <h1 className="font-bbh">
          {data?.firstName} {data?.lastName}
        </h1>

        <div className="border-t-1 p-5">
          <div className="flex justify-between">
            <h1>Likes:</h1>
            <p>0</p>
          </div>
          <div className="flex justify-between">
            <h1>Saved:</h1>
            <p>0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
