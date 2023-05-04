import React, { useEffect, useState } from "react";
import AdminSideBar from "../../components/admin/AdminSideBar";
import Loader from "../../components/user/Loader";
import AdminTable from "../../components/admin/AdminTable";
import useAdminLogout from "../../hooks/admin/useAdminLogout";
import { useSelector } from "react-redux";
import axios from "../../axios/axios";
import { useLocation, useNavigate } from "react-router-dom";

function PaidRents() {
  const [loader, setLoader] = useState(true);
  const [paidRents, setPaidRents] = useState([]);
  const { adminLogout } = useAdminLogout();
  const admin = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === "/admin/paidRents";
  const active = isActive
    ? "border border-gray-900 bg-gray-900 text-white font-bold p-1 sm:p-2 rounded-md"
    : "text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white font-bold p-1 sm:p-2 rounded-md transition duration-300";
  

  useEffect(() => {
    fetchPaidRents();
  }, []);

  const fetchPaidRents = async () => {
    try {
      setLoader(true);
      const response = await axios.get("/admin/paidRents", {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      setPaidRents(response.data.paidRents);
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

  const columns = [
    {
      Header: "User",
      Cell: ({ row }) => row.original.user.fullName,
    },
    {
      Header: "Amount Paid",
      Cell: ({ row }) => row.original.rentAmount,
    },
    {
      Header: "Payment Month",
      Cell: ({ row }) =>
        new Date(row.original.dateOfPayment).toLocaleString("default", {
          month: "long",
        }), // get month name from date
    },
    {
      Header: "Date of Payment",
      Cell: ({ row }) =>
        new Date(row.original.dateOfPayment).toLocaleDateString(),
    },
  ];

  return (
    <div className="flex h-screen">
      <div className="w-16 flex-shrink-0">
        <AdminSideBar />
      </div>
      <div className="flex-1 overflow-x-auto bg-gray-50">
        {loader ? (
          <Loader />
        ) : (
          <div className="p-5">
            <div className="flex justify-between p-3">
              <h1 className="flex text-2xl font-bold text-center">
                Rent Management
              </h1>
              <div className="flex gap-2">
                <button className={active} onClick={fetchPaidRents}>
                  Paid Rents
                </button>
                <button
                  className="text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white font-bold p-1 sm:p-2 rounded-md transition duration-300"
                  onClick={() => navigate("/admin/unpaidRents")}
                >
                  Unpaid Rents
                </button>
              </div>
            </div>
            <AdminTable columns={columns} data={paidRents} />
          </div>
        )}
      </div>
    </div>
  );
}

export default PaidRents;
