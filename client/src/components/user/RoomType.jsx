import React from "react";
import { Link } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { FaRegUser } from "react-icons/fa";
import { IoBedOutline } from "react-icons/io5";

function RoomType({ roomType }) {
  let bedType = null;
  if (roomType.capacity === 1) {
    bedType = "Single Bed";
  }

  if (roomType.capacity === 2) {
    bedType = "2 Single Bed";
  }

  if (roomType.capacity === 4) {
    bedType = "1 Bunk Bed";
  }

  if (roomType.capacity === 6) {
    bedType = "2 Bunk Bed";
  }

  return (
    <li className="flex flex-col px-2 rounded-md shadow-lg md:mx-16 lg:flex-row lg:mx-20 xl:mx-32 mt-20 mb-20">
      <div className="overflow-hidden rounded-md lg:w-2/6">
        <img
          className="w-full h-full"
          src={roomType.image.url}
          alt="room"
        ></img>
      </div>
      <div className="p-5 grid lg:grid-cols-2 w-full">
        <div className="grid gap-4">
          <div className="text-2xl font-bold">
            <h1>{roomType.title}</h1>
          </div>

          <div className="flex-wrap text-gray-600  text-xl">
            {roomType.description}
          </div>
          <div className="flex flex-wrap items-center text-gray-900 text-xl gap-6 sm:gap-6">
            <div className="flex gap-2 items-center">
              <div>
                <FaRegUser />
              </div>
              <div>
                {roomType?.capacity}{" "}
                {roomType?.capacity === 1 ? "Sleep" : "Sleeps"}
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <div>
                <IoBedOutline size={25} />
              </div>
              <div>{bedType}</div>
            </div>
          </div>
        </div>
        <div className="grid gap-6 py-5 lg:py-0 lg:flex lg:flex-col lg:items-end lg:justify-between">
          <div className="">
            <div className="text-3xl font-bold inline-block lg:text-4xl lg:font-extrabold">
              ₹{roomType?.rent}
            </div>
            <span className="px-1 text-gray-600 text-lg">/ month</span>
          </div>
          <div>
            {roomType.status === "unavailable" ? (
              <div className="flex items-center gap-1.5">
                <ImCross className="text-red-500" />
                <p className="text-red-500 font-bold">Not Available</p>
              </div>
            ) : (
              <button className="text-white bg-blue-800 py-3 px-5 rounded-lg text-xl font-bold w-full sm:w-40 transform hover:scale-110 transition duration-300">
                <Link to={`/bookRoom/${roomType._id}`}>Book Now</Link>
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default RoomType;
