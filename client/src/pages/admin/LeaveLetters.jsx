import React, { useEffect, useState } from "react";
import Loader from "../../components/user/Loader";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminTable from "../../components/admin/AdminTable";
import { useSelector } from "react-redux";
import axios from "../../axios/axios";
import useAdminLogout from "../../hooks/admin/useAdminLogout";

function LeaveLetters() {
  const admin = useSelector((state) => state.admin);
  const [loader, setLoader] = useState(true);
  const [leaveLetters, setLeaveLetters] = useState([]);
  const { adminLogout } = useAdminLogout();

  useEffect(() => {
    fetchLeaveLetters();
  }, []);

  const fetchLeaveLetters = async () => {
    try {
      const response = await axios.get("/admin/leaveLetters", {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
      console.log(response.data.leaveLetters);
      setLeaveLetters(response.data.leaveLetters);
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 401) {
        if (
          err.response.data.error === "Session timed out. Please login again."
        ) {
          // Handle "Session timed out" error
          adminLogout();
        }
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
      Header: "Leave Start Date",
      Cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString(),
    },
    {
      Header: "Leave End Date",
      Cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString(),
    },
    {
      Header: "Comments",
      Cell: ({ row }) => row.original.comments,
    },
  ];

  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <div className="flex h-screen">
          <div className="w-16 flex-shrink-0">
            <AdminSideBar />
          </div>
          <div className="flex-1 overflow-x-auto p-5 bg-gray-100">
            <div className="flex justify-between p-3">
              <h1 className="flex text-2xl font-bold text-center">
                Leave Letters
              </h1>
            </div>
            <AdminTable columns={columns} data={leaveLetters} />
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveLetters;
