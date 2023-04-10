import React, { useEffect, useState } from "react";
import Loader from "../../components/user/Loader";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminTable from "../../components/admin/AdminTable";
import { useSelector } from "react-redux";
import axios from "../../axios/axios";
import useAdminLogout from "../../hooks/admin/useAdminLogout";
import { Link } from "react-router-dom";

function AdminHostelMenu() {
  const [hostelMenu, setHostelMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const admin = useSelector((state) => state.admin);
  const { adminLogout } = useAdminLogout();

  useEffect(() => {
    async function fetchHostelMenu() {
      try {
        setLoading(true);
        const response = await axios.get("/admin/fetchHostelMenu", {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        });
        console.log(response.data.hostelMenu);
        setHostelMenu(response.data.hostelMenu);
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
        setLoading(false);
      }
    }
    fetchHostelMenu();
  }, []);

  const columns = [
    {
      Header: "#",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Day",
      Cell: ({ row }) => row.original.day,
    },
    {
      Header: "Breakfast",
      Cell: ({ row }) => row.original.breakfast.description,
    },
    {
      Header: "Lunch",
      Cell: ({ row }) => row.original.lunch.description,
    },
    {
      Header: "Snacks",
      Cell: ({ row }) => row.original.snacks.description,
    },
    {
      Header: "Dinner",
      Cell: ({ row }) => row.original.dinner.description,
    },
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <button className="bg-blue-500 text-white px-2 py-1 rounded">
          <Link to={`/admin/editHostelMenu/${row.original._id}`}>Edit</Link>
        </button>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex h-screen">
          <div className="w-16 flex-shrink-0">
            <AdminSideBar />
          </div>
          <div className="flex-1 overflow-x-auto p-5 bg-gray-100">
            <div className="flex justify-between p-3">
              <h1 className="flex text-2xl font-bold text-center">
                Hostel Menu
              </h1>
            </div>
            <AdminTable columns={columns} data={hostelMenu} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminHostelMenu;
