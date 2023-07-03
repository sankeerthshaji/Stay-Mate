import React from "react";
import UserSideBar from "../../components/user/UserSideBar";
import RentConfirmation from "../../components/user/RentConfirmation";

import React from "react";

function RentConfirmationPage() {
  return (
    <div className="flex h-screen">
      <div className="w-16 flex-shrink-0">
        <UserSideBar />
      </div>
      <RentConfirmation />
    </div>
  );
}

export default RentConfirmationPage;
