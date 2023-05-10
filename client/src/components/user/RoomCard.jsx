import React from "react";
import { Link } from "react-router-dom";
import { IoBedOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineArrowForward } from "react-icons/md";

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
      <h1 className="text-gray-900 text-lg font-bold p-4 sm:text-xl xl:text-lg">
        {roomType?.title}
      </h1>
      <div className="px-4 flex flex-wrap text-gray-900 sm:text-xl xl:text-base gap-6">
        <div className="flex gap-2 items-center">
          <div>
            <FaRegUser />
          </div>
          <div>
            {roomType?.capacity} {roomType?.capacity === 1 ? "Sleep" : "Sleeps"}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div>
            <IoBedOutline size={24} />
          </div>
          <div>{bedType && bedType}</div>
        </div>
      </div>
      <div className="flex p-4 items-center gap-2">
        <Link
          to="/roomTypes"
          className="text-[#235784] font-semibold sm:text-lg xl:text-base"
        >
          See availability
        </Link>
        <MdOutlineArrowForward color="#235784" />
      </div>
    </div>
  );
}

export default RoomCard;
