import { useAuthStore } from "@/store/AuthStore";
import { useUserStore } from "@/store/UserStore";
import { useEffect } from "react";

const Sidebar = () => {
  const authUser = useAuthStore((s) => s.user);
  const id = authUser?.id;
  const fetchUser = useUserStore((s) => s.getUser);
  const data = useUserStore((s) => s.user);

  useEffect(() => {
    if (!id) {
      alert("No user id found");
    } else {
      fetchUser(id);
    }
  }, [id, fetchUser]);

  return (
    <div className="col-span-1 h-full pr-5">
      <div className="w-full mt-10 rounded-lg p-5 border border-gray-700">
        <img
          src={data?.avatarUrl}
          alt="profile-image"
          className="w-16 h-16 rounded-full border-2 border-gray-500 mb-4"
        />
        <h1 className="font-bbh capitalize mb-3 text-lg">
          {data?.firstName} {data?.lastName}
        </h1>

        {/* Competition note */}
        <div className="rounded-md bg-gray-800 p-4 text-center text-sm text-gray-300 mt-4">
          ⚡ Like only the ones you think are worthy — keep the leaderboards
          fair!
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
