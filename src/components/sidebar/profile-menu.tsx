"use client";

import ProfileMenu from "../profile-menu";

export default function ProfileBox({ user }: { user: any }) {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Profile</h3>
      </div>
      <div className="flex items-center space-x-4">
        <ProfileMenu user={user!} />
        <div className="w-full">
          <p className="font-medium">{user?.name}</p>
          {/* <p className="text-muted-foreground text-sm">{user?.email}</p> */}
        </div>
      </div>
    </div>
  );
}
