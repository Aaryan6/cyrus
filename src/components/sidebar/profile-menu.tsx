"use client";

import { useUser } from "@/hooks/use-user";
import ProfileMenu from "../profile-menu";

export default function ProfileBox() {
  const { data: user } = useUser();
  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Profile</h3>
      </div>
      <div className="flex items-center space-x-4">
        <ProfileMenu />
        <div className="w-full">
          <p className="font-medium">{user?.full_name}</p>
          {/* <p className="text-muted-foreground text-sm">{user?.email}</p> */}
        </div>
      </div>
    </div>
  );
}
