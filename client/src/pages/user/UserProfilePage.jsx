import React from "react";
import UserSideBar from "../../components/user/UserSidebar";
import UserProfile from "../../components/user/UserProfile";

export default function UserProfilePage() {
  return (
    <div className="flex h-screen">
      <div className="w-16 flex-shrink-0">
        <UserSideBar />
      </div>
      <UserProfile />
    </div>
  );
}
