import React, { useEffect } from "react";
import success from "../../assets/img/success.png";
import tick from "../../assets/img/tick.webp";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Confirmation() {
  const resident = useSelector((state) => state.resident);

  return (
    <div className="flex flex-col justify-center items-center py-16 gap-8">
      <div className="text-center underline text-3xl font-bold text-[#2C3C4A]">
        Confirmation
      </div>
      <div className="w-40">
        <img src={success} alt="" />
      </div>
      <div className="font-bold text-[#235784] text-2xl">Thank You !</div>
      <div className="flex items-center font-semibold text-[#235784] text-xl">
        <span>
          <img className="w-16" src={tick} />
        </span>
        Payment done successfully
      </div>
      <div className="flex flex-col gap-1 font-semibold text-lg text-[#224769]">
        <div className="flex justify-center break-words w-full text-center">
          Welcome to StayMate hostel!
        </div>
        <div className="flex justify-center break-words w-full text-center px-4 sm:px-0">
          Your room number is {resident?.roomNo} and you can get the keys from the
          warden's office.
        </div>
        <div className="flex justify-center break-words w-full text-center px-4 sm:px-0">
          Contact us if you need any help. We hope you enjoy your stay!
        </div>
      </div>

      <div>
        <button className="bg-[#235784] text-white text-lg px-8 py-2 rounded-md transform hover:scale-105 transition duration-300">
          <Link to="/userProfile">Take me to my Profile</Link>
        </button>
      </div>
    </div>
  );
}

export default Confirmation;
