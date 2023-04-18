import React from "react";
import UserSideBar from "../../components/user/UserSideBar";
import Review from "../../components/user/Review/Review";

function ReviewPage() {
  return (
    <div className="flex h-screen">
      <div className="w-16 flex-shrink-0">
        <UserSideBar />
      </div>
      <div className="flex-1">
        <Review />
      </div>
    </div>
  );
}

export default ReviewPage;
