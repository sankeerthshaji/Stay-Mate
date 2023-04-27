import React, { useEffect, useState } from "react";
import AdminSideBar from "../../components/admin/AdminSideBar";
import useAdminLogout from "../../hooks/admin/useAdminLogout";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "../../axios/axios";
import Loader from "../../components/user/Loader";
import GuestDetails from "../../components/admin/GuestDetails";

function GuestDetailsPage() {
  const { id } = useParams();
  const admin = useSelector((state) => state.admin);
  const [guestDetails, setGuestDetails] = useState({});
  const [formattedDateOfBirth, setFormattedDateOfBirth] = useState("");
  const [loader, setLoader] = useState(true);
  const { adminLogout } = useAdminLogout();

  useEffect(() => {
    fetchGuestDetails();
  },[guestDetails]);

  const fetchGuestDetails = async () => {
    try {
      const response = await axios.get(`/admin/guestDetails/${id}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
      setGuestDetails(response.data.guestDetails);
      // Format date of birth
      const dateStr = response.data.guestDetails.dateOfBirth;
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      setFormattedDateOfBirth(formattedDate);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle 401 errors
        adminLogout();
        console.error(err); // log the error message
      } else {
        // Handle other errors
        console.error(err); // log the error message
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <div className="flex h-screen">
          <div className="w-16 flex-shrink-0">
            <AdminSideBar />
          </div>
          <div className="flex-grow bg-gray-50">
            <GuestDetails
              guestDetails={guestDetails}
              formattedDateOfBirth={formattedDateOfBirth}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default GuestDetailsPage;
