import React from "react";
import UserSideBar from "../../components/user/UserSideBar";
import RentDue from "../../components/user/RentDue";

export default function RentDuePage() {
  return (
    <div className="flex h-screen">
      <div className="w-16 flex-shrink-0">
        <UserSideBar />
      </div>
      <RentDue />
    </div>
  );
}
