import React from "react";

function GuestDetails({ guestDetails, formattedDateOfBirth }) {
  return (
    <div className="lg:flex lg:justify-center items-center h-screen gap-12">
      <div>
        <div className="flex justify-center py-5 lg:py-3">
          <div className="rounded-md shadow-lg border-4 px-6 sm:px-12 md:px-24 lg:px-16 py-5 sm:py-8 lg:py-5">
            <div>
              <img className="w-36 sm:w-full" src={guestDetails.image.url} />
            </div>
            <div>
              <h1 className="py-3 sm:text-2xl text-center font-bold">
                {guestDetails.fullName}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center py-5 lg:py-3">
          <div className="flex flex-col gap-2 lg:gap-1 rounded-md shadow-lg border-4 px-3 sm:px-6 md:px-16 lg:px-8 py-4">
            <div className="font-bold text-lg sm:text-2xl">Address</div>
            <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
              {guestDetails.address.houseName}
            </p>
            <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
              {guestDetails.address.area}
            </p>
            <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
              {guestDetails.address.landmark}
            </p>
            <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
              {guestDetails.address.city}
            </p>
            <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
              {guestDetails.address.state}
            </p>
            <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
              {guestDetails.address.country}
            </p>
            <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
              {guestDetails.address.pincode}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center py-5 lg:py-0">
        <div className="rounded-md shadow-xl border-4 sm:px-5">
          <div className="px-2 py-3 sm:p-5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
            <div className="font-bold sm:text-xl md:text-xl">Full Name</div>
            <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
              {guestDetails.fullName}
            </div>
          </div>
          <div className="px-2 py-3 sm:p-5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
            <div className="font-bold sm:text-xl md:text-xl">Email</div>
            <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
              {guestDetails.email}
            </div>
          </div>
          <div className="px-2 py-3 sm:p-5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
            <div className="font-bold sm:text-xl md:text-xl">Mobile</div>
            <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
              {guestDetails.mobileNumber}
            </div>
          </div>
          <div className="px-2 py-3 sm:p-5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
            <div className="font-bold sm:text-xl md:text-xl">Gender</div>
            <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
              {guestDetails.gender}
            </div>
          </div>
          <div className="px-2 py-3 sm:p-5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
            <div className="font-bold sm:text-xl md:text-xl">Date of Birth</div>
            <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
              {formattedDateOfBirth}
            </div>
          </div>
          <div className="px-2 py-3 sm:p-5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
            <div className="font-bold sm:text-xl md:text-xl">Aadhar No</div>
            <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
              {guestDetails.aadharNumber}
            </div>
          </div>
          <div className="px-2 py-3 sm:p-5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
            <div className="font-bold sm:text-xl md:text-xl">Blood Group</div>
            <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
              {guestDetails.bloodGroup}
            </div>
          </div>
          <div className="px-2 py-3 sm:p-5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
            <div className="font-bold sm:text-xl md:text-xl">Parent Name</div>
            <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
              {guestDetails.parentName}
            </div>
          </div>
          <div className="px-2 py-3 sm:p-5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
            <div className="font-bold sm:text-xl md:text-xl">Parent Mobile</div>
            <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
              {guestDetails.parentMobileNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestDetails;
