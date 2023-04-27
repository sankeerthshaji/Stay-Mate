import React from "react";
import UserSideBar from "../../components/user/UserSideBar";
import VacatingLetterForm from "../../components/user/VacatingLetterForm";

function VacatingLetter() {
  return (
    <div className="flex h-screen">
      <div className="w-16 flex-shrink-0">
        <UserSideBar />
      </div>
      <div className="flex-1 bg-gray-50">
      <VacatingLetterForm />
      </div>
    </div>
  );
}

export default VacatingLetter;
