import React from "react";
import { Link } from "react-router-dom";
import { ImCross } from "react-icons/im";

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
          <div className="flex flex-wrap text-gray-900 text-xl">
            <div className="flex items-center">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <div>
                {roomType.capacity}{" "}
                {roomType.capacity === 1 ? "Sleep" : "Sleeps"}
              </div>
            </div>

            <div className="flex gap-2 items-center px-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                />
              </svg>
              {bedType}
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
