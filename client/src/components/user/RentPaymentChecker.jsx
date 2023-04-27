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
        const { data } = await axios.get(`/rentPaymentStatus`, {
          params: { resident },
          headers: {
            Authorization: `Bearer ${resident.token}`,
          },
        });
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
        if (err.response && err.response.status === 401) {
          // Handle 401 errors
          logout();
          console.error(err); // log the error message
        } else {
          // Handle other errors
          console.error(err); // log the error message
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRentPaymentStatus();
  });

  return <div>{loading ? <Loader /> : <>{children}</>}</div>;
}

export default RentPaymentChecker;
