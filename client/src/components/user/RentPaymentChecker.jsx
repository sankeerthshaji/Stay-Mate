import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios/axios";
import useLogout from "../../hooks/user/useLogout";
import Loader from "./Loader";
import Swal from "sweetalert2";

function RentPaymentChecker({ children }) {
  const [loading, setLoading] = useState(true);
  const resident = useSelector((state) => state.resident);
  const { logout } = useLogout();

  useEffect(() => {
    const fetchRentPaymentStatus = async () => {
      try {
        console.log(resident._id, resident.token);
        const { data } = await axios.get(`/rentPaymentStatus`, {
          params: { resident },
          headers: {
            Authorization: `Bearer ${resident.token}`,
          },
        });
        console.log(data);
        if (data.status === "Late") {
          // Handle late payment
          logout();
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You have been removed from the hostel due to late payment.',
          });
          return;
        }
      } catch (err) {
        console.log(err);
        if (err.response && err.response.status === 401) {
          if (
            err.response.data.error === "Session timed out. Please login again."
          ) {
            // Handle "Session timed out" error
            logout();
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRentPaymentStatus();
  }, [resident._id, resident.token]);

  return <div>{loading ? <Loader /> : <>{children}</>}</div>;
}

export default RentPaymentChecker;
