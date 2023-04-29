import React from "react";
import ChangePasswordForm from "../../components/user/ChangePasswordForm";
import UserSideBar from "../../components/user/UserSideBar";

function ChangePassword() {
  return (
    <div className="flex h-screen">
      <div className="w-16 flex-shrink-0">
        <UserSideBar />
      </div>
      <ChangePasswordForm />
    </div>
  );
}

export default ChangePassword;
