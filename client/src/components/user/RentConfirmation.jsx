import React from "react";
import success from "../../assets/img/success.png";
import tick from "../../assets/img/tick.webp";
import { Link } from "react-router-dom";

function RentConfirmation() {
  return (
    <div className="flex flex-1 flex-col justify-center items-center py-16 gap-6">
      <div className="w-44">
        <img src={success} alt="" />
      </div>
      <div className="font-bold text-[#235784] text-3xl">Thank You!</div>
      <div className="flex items-center font-semibold text-[#235784] text-2xl">
        <span>
          <img className="w-16" src={tick} />
        </span>
        Payment done successfully
      </div>
      <div>
        <button className="bg-[#235784] text-white text-lg px-4 py-2 rounded-md transform hover:scale-105 transition duration-300">
          <Link to="/rentPaid">See Rent History</Link>
        </button>
      </div>
    </div>
  );
}

export default RentConfirmation;
