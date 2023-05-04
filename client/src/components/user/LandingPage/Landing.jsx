import React, { useEffect, useState } from "react";
import bed from "../../../assets/img/bed.webp";
import about from "../../../assets/img/about.webp";
import { Link } from "react-router-dom";
import axios from "../../../axios/axios";
import RoomCard from "../RoomCard";
import FeatureIcon from "./FeatureIcon";
import { AiOutlineWifi } from "react-icons/ai";
import { TfiLocationPin } from "react-icons/tfi";
import { MdOutlineLuggage } from "react-icons/md";
import { CiParking1 } from "react-icons/ci";
import { FiArrowRight } from "react-icons/fi";
import gallery01 from "../../../assets/img/gallery01.webp";
import gallery02 from "../../../assets/img/gallery02.webp";
import gallery03 from "../../../assets/img/gallery03.webp";
import gallery04 from "../../../assets/img/gallery04.webp";
import GalleryImage from "./GalleryImage";

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
            {roomTypes &&
              roomTypes.map((roomType) => (
                <RoomCard key={roomType._id} roomType={roomType} />
              ))}
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 2xl:grid-cols-5">
        <div className="px-8 py-12 max-w-md sm:max-w-xl mx-auto lg:px-12 lg:py-24 lg:max-w-full xl:mr-0 2xl:col-span-2">
          <div className="xl:max-w-xl">
            <img
              className="rounded-lg shadow-xl sm:h-64 sm:w-full object-cover object-center lg:hidden"
              src={about}
              alt="about"
            />
            <h1 className="mt-6 sm:mt-8 lg:mt-0 font-bold text-3xl text-gray-900 sm:text-4xl lg:text-3xl xl:text-4xl">
              We have everything you need
            </h1>
            <p className="mt-2 text-gray-600 sm:mt-4 text-xl">
              Posuere morbi leo urna molestie at elementum eu facilisis sed.
              Diam phasellus vestibulum lorem sed risus ultricies tristique
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-8">
              <FeatureIcon
                icon={<AiOutlineWifi size={60} color="#235784" />}
                text="Free available high speed WiFi"
              />
              <FeatureIcon
                icon={<TfiLocationPin size={60} color="#235784" />}
                text="Сonvenient location in the center"
              />
              <FeatureIcon
                icon={<MdOutlineLuggage size={60} color="#235784" />}
                text="Free storage of luggage of any size"
              />
              <FeatureIcon
                icon={<CiParking1 size={60} color="#235784" />}
                text="Parking place allocated to you"
              />
            </div>
            <div className="mt-6 sm:mt-10 flex flex-col-reverse sm:flex-row sm:items-center gap-6">
              <Link
                className="px-5 py-3 w-full sm:w-1/3 text-center inline-block rounded-lg text-white bg-indigo-500 font-semibold 
                text-sm uppercase tracking-wider hover:bg-indigo-400 sm:text-base hover:-translate-y-0.5 
                transform transition focus:outline-none focus:ring focus:ring-offset-2 focus:ring-indigo-500 
                focus:ring-opacity-50 active:bg-indigo-600"
                to="/roomTypes"
              >
                Book Now
              </Link>
              <div className="text-center flex justify-center items-center gap-2">
                <Link
                  to="/about"
                  className="text-[#235784] text-lg font-semibold"
                >
                  More about
                </Link>
                <FiArrowRight color="#235784" />
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative 2xl:col-span-3">
          <img
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={about}
            alt="about"
          />
        </div>
      </div>
      <div className="px-8 py-12 max-w-md mx-auto sm:max-w-xl lg:px-12 lg:py-24 lg:max-w-full">
        <h1 className="mt-6 sm:mt-8 lg:mt-0 font-bold text-3xl text-gray-900 sm:text-4xl lg:text-3xl xl:text-4xl">
          Photos of our rooms
        </h1>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <GalleryImage img={gallery01} />
          <GalleryImage img={gallery02} />
          <GalleryImage img={gallery03} />
          <GalleryImage img={gallery04} />
        </div>
      </div>
    </div>
  );
}

export default Landing;
