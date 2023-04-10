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
        console.log(response.data.hostelMenu);
        setHostelMenu(response.data.hostelMenu);
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
  ];

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex h-screen">
          <div className="w-16 flex-shrink-0">
            <UserSideBar />
          </div>
          <div className="flex-1 overflow-x-auto">
            <UserTable columns={columns} data={hostelMenu} title={"Hostel Menu"}/>
          </div>
        </div>
      )}
    </div>
  );
}

export default HostelMenu;
