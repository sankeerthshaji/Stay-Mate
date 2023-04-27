import React, { useEffect, useState } from "react";
import Loader from "../../components/user/Loader";
import UserSideBar from "../../components/user/UserSideBar";
import UserTable from "../../components/user/UserTable";
import { useSelector } from "react-redux";
import axios from "../../axios/axios";
import useLogout from "../../hooks/user/useLogout";

function HostelMenu() {
  const [hostelMenu, setHostelMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const resident = useSelector((state) => state.resident);
  const { logout } = useLogout();

  useEffect(() => {
    async function fetchHostelMenu() {
      try {
        setLoading(true);
        const response = await axios.get("/fetchHostelMenu", {
          headers: {
            Authorization: `Bearer ${resident.token}`,
          },
        });

        setHostelMenu(response.data.hostelMenu);
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
      Cell: ({ row }) => row.original.breakfast,
    },
    {
      Header: "Lunch",
      Cell: ({ row }) => row.original.lunch,
    },
    {
      Header: "Snacks",
      Cell: ({ row }) => row.original.snacks,
    },
    {
      Header: "Dinner",
      Cell: ({ row }) => row.original.dinner,
    },
  ];

  return (
    <div className="flex h-screen">
      <div className="w-16 flex-shrink-0">
        <UserSideBar />
      </div>
      <div className="flex-1 overflow-x-auto p-5 bg-gray-50">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="flex justify-between p-3">
              <h1 className="flex text-2xl font-bold text-center">
                Hostel Menu
              </h1>
            </div>
            <UserTable columns={columns} data={hostelMenu} />
          </>
        )}
      </div>
    </div>
  );
}

export default HostelMenu;
