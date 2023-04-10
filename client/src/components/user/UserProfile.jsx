import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useLogout from "../../hooks/user/useLogout";
import axios from "../../axios/axios";
import Loader from "./Loader";
import { Link } from "react-router-dom";

function UserProfile() {
  const resident = useSelector((state) => state.resident);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [formattedDateOfBirth, setFormattedDateOfBirth] = useState("");
  const { logout } = useLogout();

  const handleTokenExpiration = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/userProfile/${resident.id}`, {
          headers: {
            Authorization: `Bearer ${resident.token}`,
          },
        });
        console.log(response.data.userDetails);
        setUserDetails(response.data.userDetails);

        // Format date of birth
        const dateStr = response.data.userDetails.dateOfBirth;
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        setFormattedDateOfBirth(formattedDate);
      } catch (err) {
        console.log(err);
        if (err.response && err.response.status === 401) {
          if (
            err.response.data.error === "Session timed out. Please login again."
          ) {
            // Handle "Session timed out" error
            handleTokenExpiration();
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [resident.id, resident.token]);

  return (
    <div className="flex-grow bg-gray-50">
      {loading ? (
        <Loader />
      ) : (
        <div className="lg:flex lg:justify-center items-center h-screen gap-12">
          <div>
            <div className="flex justify-center py-5 lg:py-3">
              <div className="rounded-md shadow-lg border-4 px-6 sm:px-12 md:px-24 lg:px-16 py-5 sm:py-8 lg:py-3.5">
                <div>
                  <img className="w-36 sm:w-full" src={userDetails.image.url} />
                </div>
                <div>
                  <h1 className="py-3 sm:text-2xl text-center font-bold">
                    {userDetails.fullName}
                  </h1>
                </div>
                <div className="flex justify-center">
                  <Link to="/editProfile">
                    <button className="text-blue-500 sm:text-xl font-semibold px-5 py-2 md:px-8 border-2 border-blue-500 bg-white hover:bg-blue-500 hover:text-white rounded-md transition-all duration-300">
                      Edit Profile
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center py-5 lg:py-3">
              <div className="flex flex-col gap-2 lg:gap-1 rounded-md shadow-lg border-4 px-3 sm:px-6 md:px-16 lg:px-8 py-4">
                <div className="font-bold text-lg sm:text-2xl">Address</div>
                <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
                  {userDetails.address.houseName}
                </p>
                <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
                  {userDetails.address.area}
                </p>
                <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
                  {userDetails.address.landmark}
                </p>
                <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
                  {userDetails.address.city}
                </p>
                <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
                  {userDetails.address.state}
                </p>
                <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
                  {userDetails.address.country}
                </p>
                <p className="text-[#2C3C4A] sm:text-2xl lg:text-xl font-semibold">
                  {userDetails.address.pincode}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center py-5 lg:py-0">
            <div className="rounded-md shadow-xl border-4 sm:px-5">
              <div className="px-2 py-3 sm:p-3.5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
                <div className="font-bold sm:text-xl md:text-xl">Full Name</div>
                <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                  {userDetails.fullName}
                </div>
              </div>
              <div className="px-2 py-3 sm:p-3.5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
                <div className="font-bold sm:text-xl md:text-xl">Email</div>
                <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                  {userDetails.email}
                </div>
              </div>
              <div className="px-2 py-3 sm:p-3.5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
                <div className="font-bold sm:text-xl md:text-xl">Mobile</div>
                <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                  {userDetails.mobileNumber}
                </div>
              </div>
              <div className="px-2 py-3 sm:p-3.5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
                <div className="font-bold sm:text-xl md:text-xl">Gender</div>
                <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                  {userDetails.gender}
                </div>
              </div>
              <div className="px-2 py-3 sm:p-3.5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
                <div className="font-bold sm:text-xl md:text-xl">
                  Date of Birth
                </div>
                <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                  {formattedDateOfBirth}
                </div>
              </div>
              <div className="px-2 py-3 sm:p-3.5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
                <div className="font-bold sm:text-xl md:text-xl">Aadhar No</div>
                <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                  {userDetails.aadharNumber}
                </div>
              </div>
              <div className="px-2 py-3 sm:p-3.5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
                <div className="font-bold sm:text-xl md:text-xl">
                  Blood Group
                </div>
                <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                  {userDetails.bloodGroup}
                </div>
              </div>
              <div className="px-2 py-3 sm:p-3.5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
                <div className="font-bold sm:text-xl md:text-xl">Parent Name</div>
                <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                  {userDetails.parentName}
                </div>
              </div>
              <div className="px-2 py-3 sm:p-3.5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
                <div className="font-bold sm:text-xl md:text-xl">Parent Mobile</div>
                <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                  {userDetails.parentMobileNumber}
                </div>
              </div>
              <div className="px-2 py-3 sm:p-3.5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
                <div className="font-bold sm:text-xl md:text-xl">Room No</div>
                <div className="text-[#2C3C4A] sm:text-lg md:text-xl sm:font-semibold md:font-bold">
                  {userDetails.roomNo}
                </div>
              </div>
              <div className="px-2 py-3 sm:p-3.5 flex justify-between items-center gap-3 sm:gap-24 border-b-4">
                <div className="font-bold sm:text-xl md:text-xl">Password</div>
                <Link to="/changePassword">
                  <button className="text-blue-500 sm:text-xl font-semibold px-5 py-2 border-2 border-blue-500 bg-white hover:bg-blue-500 hover:text-white rounded-md transition-all duration-300">
                    Change Password
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
