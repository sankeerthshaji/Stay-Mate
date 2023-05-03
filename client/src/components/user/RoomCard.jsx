import React from "react";
import { IoBedOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { VscCircleFilled } from "react-icons/vsc";

function RoomCard({ roomType }) {
  let bedType = null;
  if (roomType?.capacity === 1) {
    bedType = "Single Bed";
  }

  if (roomType?.capacity === 2) {
    bedType = "2 Single Bed";
  }

  if (roomType?.capacity === 4) {
    bedType = "1 Bunk Bed";
  }

  if (roomType?.capacity === 6) {
    bedType = "2 Bunk Bed";
  }

  return (
    <div className="shadow-xl rounded-lg overflow-hidden">
      <img src={roomType?.image?.url} alt="room" />
      <h1 className="text-gray-900 text-lg font-bold p-4 sm:text-xl xl:text-lg">{roomType?.title}</h1>
      <div className="px-4 flex flex-wrap text-gray-900 sm:text-xl xl:text-base">
        <div className="flex gap-2 items-center">
          <div>
            <FaRegUser />
          </div>
          <div>
            {roomType?.capacity} {roomType?.capacity === 1 ? "Sleep" : "Sleeps"}
          </div>
        </div>

        <div className="flex gap-2 items-center px-6">
          <div>
            <IoBedOutline size={24} />
          </div>
          <div>{bedType && bedType}</div>
        </div>
      </div>
      {roomType?.status === "unavailable" ? (
        <div className="flex p-3 gap-1">
          <VscCircleFilled size={24} className="text-red-500" />
          <p className="text-red-500 font-bold ">Not Available</p>
        </div>
      ) : (
        <div className="flex p-3 gap-1">
          <VscCircleFilled size={24} className="text-green-500" />
          <p className="text-green-500 font-bold">Available</p>
        </div>
      )}
    </div>
  );
}

export default RoomCard;
