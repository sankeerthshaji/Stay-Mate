import React, { useEffect, useState } from "react";
import Loader from "../../components/user/Loader";
import UserSideBar from "../../components/user/UserSideBar";
import UserTable from "../../components/user/UserTable";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useLogout from "../../hooks/user/useLogout";
import axios from "../../axios/axios";

function RentPaid() {
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const resident = useSelector((state) => state.resident);
  const { logout } = useLogout();
  const [rentPaid, setRentPaid] = useState({});

  useEffect(() => {
    fetchRentPaid();
  }, []);

  const fetchRentPaid = async () => {
    try {
      const userId = resident.id;
      const response = await axios.get("/rentPaid", {
        params: { userId },
        headers: {
          Authorization: `Bearer ${resident.token}`,
        },
      });
      console.log(response.data.rentPaid);
      setRentPaid(response.data.rentPaid);
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
      setLoader(false);
    }
  };

  const columns = [
    {
      Header: "#",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Payment Id",
      Cell: ({ row }) => row.original._id,
    },
    {
        Header: "Month",
        Cell: ({ row }) => row.original.monthOfPayment,
    },
    {
      Header: "Payment Date",
      Cell: ({ row }) => new Date(row.original.dateOfPayment).toLocaleDateString(),
    },
    {
      Header: "Rent Amount",
      Cell: ({ row }) => row.original.rentAmount,
    }
  ];

  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <div className="flex h-screen">
          <div className="w-16 flex-shrink-0">
            <UserSideBar />
          </div>
          <div className="flex-1 overflow-x-auto p-5 bg-gray-100">
            <div className="flex justify-between p-3">
              <h1 className="flex text-2xl font-bold text-center">
                Rent History
              </h1>
            </div>
            <UserTable columns={columns} data={rentPaid} />
          </div>
        </div>
      )}
    </div>
  );
}

export default RentPaid;
