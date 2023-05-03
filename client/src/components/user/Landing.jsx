import React, { useEffect, useState } from "react";
import bed from "../../assets/img/bed.webp";
import { Link } from "react-router-dom";
import axios from "../../axios/axios";
import RoomCard from "./RoomCard";

function Landing() {
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    async function fetchRoomTypes() {
      try {
        const response = await axios.get("/roomTypes");
        setRoomTypes(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRoomTypes();
  }, []);

  return (
    <div className="lg:mt-16">
      <div className="grid lg:grid-cols-2 2xl:grid-cols-5">
        <div className="px-8 py-12 max-w-md mx-auto sm:max-w-xl lg:px-12 lg:py-24 lg:max-w-full xl:mr-0 2xl:col-span-2">
          <div className="xl:max-w-xl">
            <img
              className="rounded-lg shadow-xl sm:h-64 sm:w-full object-cover object-center lg:hidden"
              src={bed}
              alt="bed"
            />
            <h1 className="mt-6 sm:mt-8 font-bold text-2xl text-gray-900 sm:text-4xl lg:text-3xl xl:text-4xl">
              Staymate - Affordable and Comfortable Hostel Living.
            </h1>
            <p className="mt-2 text-gray-600 sm:mt-4 sm:text-xl">
              Egestas pretium aenean pharetra magna ac. Et tortor consequat id
              porta nibh venenatis cras sed. Vel turpis nunc eget lorem dolor
              sed
            </p>
            <div className="mt-4 sm:mt-6">
              <Link
                className="px-5 py-3 inline-block rounded-lg text-white bg-indigo-500 font-semibold 
                text-sm uppercase tracking-wider hover:bg-indigo-400 sm:text-base hover:-translate-y-0.5 
                transform transition focus:outline-none focus:ring focus:ring-offset-2 focus:ring-indigo-500 
                focus:ring-opacity-50 active:bg-indigo-600"
                to="/admission"
              >
                Apply for Admission
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative 2xl:col-span-3">
          <img
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={bed}
            alt="bed"
          />
        </div>
      </div>
      <div className="px-8 py-12 lg:px-12 lg:py-24">
        <h1 className="text-center lg:text-left font-bold text-2xl text-gray-900 sm:text-4xl lg:text-3xl xl:text-4xl">
          Hostel rooms
        </h1>
        <div className="mt-6">
          <div className="grid max-w-sm mx-auto sm:max-w-lg lg:max-w-6xl xl:max-w-full lg:grid-cols-2 xl:grid-cols-4 gap-10">
            {roomTypes && roomTypes.map((roomType) => (
            <RoomCard key={roomType._id} roomType={roomType} />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
