import React from "react";
import UserSideBar from "../../components/user/userSideBar";
import EditProfile from "../../components/user/EditProfile";

export default function EditProfilePage() {
  return (
    <div className="flex h-screen">
      <div className="w-16 flex-shrink-0">
        <UserSideBar />
      </div>
      <EditProfile />
    </div>
  );
}
