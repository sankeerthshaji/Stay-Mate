import React from "react";

function ResidentDetails({
  onClick,
  residentDetails,
  formattedDateOfBirth,
  roomTypeDetails,
}) {
  return (
    <>
      <div className="lg:flex lg:justify-center items-center h-screen gap-12">
        <div>
          <div className="flex justify-center py-4">
            <div className="rounded-md shadow-lg border-4 px-6 sm:px-12 md:px-24 lg:px-16 py-5 sm:py-8">
              <div>
                <img className="w-full" src={residentDetails?.image?.url} />
              </div>
              <div>
                <h1 className="py-4 sm:text-2xl text-center font-bold">
                  {residentDetails?.fullName}
                </h1>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={onClick}
                  className="text-blue-500 sm:text-xl font-semibold px-5 py-2 md:px-8 border-2 border-blue-500 bg-white hover:bg-blue-500 hover:text-white rounded-md transition-all duration-300"
                >
                  Change Room No
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center py-4">
            <div className="flex flex-col gap-2 lg:gap-1 rounded-md shadow-lg border-4 px-3 sm:px-6 md:px-16 lg:px-8 py-4">
              <div className="font-bold text-lg sm:text-2xl">Address</div>
              <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
                {residentDetails?.address?.houseName}
              </p>
              <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
                {residentDetails?.address?.area}
              </p>
              <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
                {residentDetails?.address?.landmark}
              </p>
              <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
                {residentDetails?.address?.city}
              </p>
              <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
                {residentDetails?.address?.state}
              </p>
              <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
                {residentDetails?.address?.country}
              </p>
              <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
                {residentDetails?.adress?.pincode}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center py-3">
          <div className="rounded-md shadow-xl border-4 sm:px-5">
            <div className="px-2 py-3 sm:p-4 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
              <div className="font-bold sm:text-xl md:text-xl">Full Name</div>
              <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                {residentDetails?.fullName}
              </div>
            </div>
            <div className="px-2 py-3 sm:p-4 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
              <div className="font-bold sm:text-xl md:text-xl">Email</div>
              <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                {residentDetails?.email}
              </div>
            </div>
            <div className="px-2 py-3 sm:p-4 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
              <div className="font-bold sm:text-xl md:text-xl">Mobile</div>
              <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                {residentDetails?.mobileNumber}
              </div>
            </div>
            <div className="px-2 py-3 sm:p-4 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
              <div className="font-bold sm:text-xl md:text-xl">Gender</div>
              <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                {residentDetails?.gender}
              </div>
            </div>
            <div className="px-2 py-3 sm:p-4 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
              <div className="font-bold sm:text-xl md:text-xl">
                Date of Birth
              </div>
              <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                {formattedDateOfBirth}
              </div>
            </div>
            <div className="px-2 py-3 sm:p-4 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
              <div className="font-bold sm:text-xl md:text-xl">Aadhar No</div>
              <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                {residentDetails?.aadharNumber}
              </div>
            </div>
            <div className="px-2 py-3 sm:p-4 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
              <div className="font-bold sm:text-xl md:text-xl">Blood Group</div>
              <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                {residentDetails?.bloodGroup}
              </div>
            </div>
            <div className="px-2 py-3 sm:p-4 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
              <div className="font-bold sm:text-xl md:text-xl">Parent Name</div>
              <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                {residentDetails?.parentName}
              </div>
            </div>
            <div className="px-2 py-3 sm:p-4 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
              <div className="font-bold sm:text-xl md:text-xl">
                Parent Mobile
              </div>
              <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                {residentDetails?.parentMobileNumber}
              </div>
            </div>
            <div className="px-2 py-3 sm:p-4 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
              <div className="font-bold sm:text-xl md:text-xl">Room No</div>
              <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                {residentDetails?.roomNo}
              </div>
            </div>
            <div className="px-2 py-3 sm:p-4 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
              <div className="font-bold sm:text-xl md:text-xl">Room Type</div>
              <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                {roomTypeDetails?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ResidentDetails;
