import React, { useEffect, useState } from "react";
import Loader from "../../components/user/Loader";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminTable from "../../components/admin/AdminTable";
import { useSelector } from "react-redux";
import axios from "../../axios/axios";
import useAdminLogout from "../../hooks/admin/useAdminLogout";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const admin = useSelector((state) => state.admin);
  const { adminLogout } = useAdminLogout();

  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true);
        const response = await axios.get("/admin/rooms", {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        });

        setRooms(response.data.rooms);
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
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  const columns = [
    {
      Header: "Room No.",
      Cell: ({ row }) => row.original.roomNo,
    },
    {
      Header: "Type",
      Cell: ({ row }) => row.original.roomType.name,
    },
    {
      Header: "Capacity",
      Cell: ({ row }) => row.original.capacity,
    },
    {
      Header: "Occupants",
      Cell: ({ row }) => row.original.occupants,
    },
    {
      Header: "Status",
      Cell: ({ row }) => row.original.status,
    },
  ];

  return (
    <div className="flex h-screen">
      <div className="w-16 flex-shrink-0">
        <AdminSideBar />
      </div>
      <div className="flex-1 overflow-x-auto">
        {loading ? (
          <Loader />
        ) : (
          <div className="p-5">
            <div className="flex justify-between p-3">
              <h1 className="flex text-2xl font-bold text-center">
                Hostel Rooms
              </h1>
            </div>
            <AdminTable columns={columns} data={rooms} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Rooms;
