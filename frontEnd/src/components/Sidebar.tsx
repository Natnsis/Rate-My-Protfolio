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
    }
    fetchUser(id!);
  }, [id, fetchUser]);

  return (
    <div className="col-span-1 h-full gap-5 border-r-1 pr-5">
      <div className="w-full mt-10 rounded-lg p-5 border-1">
        <img
          src={data?.avatarUrl}
          alt="profile-image"
          className="w-15 h-15 rounded-full border-2 "
        />
        <h1 className="font-bbh capitalize mb-3">
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
