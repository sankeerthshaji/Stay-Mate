import React from "react";
import { Link } from "react-router-dom";
import hostelPic from "../../assets/img/hostelPic.jpeg";

function About() {
  return (
    <div className="lg:mt-16">
      <div className="grid lg:grid-cols-2 2xl:grid-cols-5">
        <div className="px-8 py-12 max-w-md mx-auto sm:max-w-xl lg:px-12 lg:py-24 lg:max-w-full xl:mr-0 2xl:col-span-2">
          <div className="xl:max-w-xl">
            <img
              className="rounded-lg shadow-xl sm:h-64 sm:w-full object-cover object-center lg:hidden"
              src={hostelPic}
              alt="hostel pic"
            />
            <h1 className="mt-6 sm:mt-8 font-bold text-2xl text-gray-900 sm:text-4xl lg:text-3xl xl:text-4xl">
              About Us
            </h1>
            <p className="mt-2 text-gray-600 sm:mt-4 sm:text-xl">
              StayMate Hostel is a cozy and budget-friendly place to stay in
              Kerala. We offer free essential services and ensure the safety and
              security of our guests and their belongings. Our rooms are
              spacious, airy and well-lit with a home-like atmosphere. We
              welcome our guests with warmth and hospitality.
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
            src={hostelPic}
            alt="hostel pic"
          />
        </div>
      </div>
    </div>
  );
}

export default About;
