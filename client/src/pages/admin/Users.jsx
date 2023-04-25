import React, { useState, useEffect } from "react";
import AdminTable from "../../components/admin/AdminTable";
import AdminSideBar from "../../components/admin/AdminSideBar";
import axios from "../../axios/axios";
import Loader from "../../components/user/Loader";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useLogout from "../../hooks/user/useLogout";
import useAdminLogout from "../../hooks/admin/useAdminLogout";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function Users() {
  const admin = useSelector((state) => state.admin);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useLogout();
  const { adminLogout } = useAdminLogout();

  const handleTokenExpiration = () => {
    adminLogout();
    toast.error("Your session has expired. Please log in again.");
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
      
      setUsers(response.data.users);
    } catch (err) {
      
      if (err.response && err.response.status === 401) {
        if (
          err.response.data.error === "Session timed out. Please login again."
        ) {
          // Handle "Session timed out" error
          adminLogout();
        } else if (err.response.data.error === "Request is not authorized") {
          // Handle "Request is not authorized" error
          
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const blockUser = async (id) => {
    try {
      const response = await axios.post(
        "/admin/blockUser",
        { id },
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );
      
      logout();
      toast.success("User blocked successfully");
      fetchUsers();
    } catch (err) {
      
      if (err.response && err.response.status === 401) {
        if (
          err.response.data.error === "Session timed out. Please login again."
        ) {
          // Handle "Session timed out" error
          handleTokenExpiration();
        } else if (err.response.data.error === "Request is not authorized") {
          // Handle "Request is not authorized" error
          toast.error("You are not authorized to perform this action.");
        }
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const unblockUser = async (id) => {
    try {
      const response = await axios.post(
        "/admin/unblockUser",
        { id },
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );
      
      toast.success("User unblocked successfully");
      fetchUsers();
    } catch (err) {
      
      if (err.response && err.response.status === 401) {
        if (
          err.response.data.error === "Session timed out. Please login again."
        ) {
          // Handle "Session timed out" error
          handleTokenExpiration();
        } else if (err.response.data.error === "Request is not authorized") {
          // Handle "Request is not authorized" error
          toast.error("You are not authorized to perform this action.");
        }
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const removeAsResident = async (id) => {
    try {
      const response = await axios.post(
        "/admin/removeAsResident",
        {
          userId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );
      
      logout();
      fetchUsers();
      toast.success("User removed as resident successfully");
    } catch (err) {
      
      if (err.response && err.response.status === 401) {
        if (
          err.response.data.error === "Session timed out. Please login again."
        ) {
          // Handle "Session timed out" error
          handleTokenExpiration();
        } else if (err.response.data.error === "Request is not authorized") {
          // Handle "Request is not authorized" error
          toast.error("You are not authorized to perform this action.");
        }
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const confirmBlock = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Block this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Block",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        blockUser(id);
      }
    });
  };

  const confirmUnblock = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Unblock this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22C55E",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Unblock",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        unblockUser(id);
      }
    });
  };

  const confirmRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Remove this user as Resident?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        removeAsResident(id);
      }
    });
  };

  const columns = [
    {
      Header: "No",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Name",
      accessor: "fullName",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Role",
      accessor: "role",
    },
    {
      Header: "More Details",
      Cell: ({ row }) => {
        if (row.original.role === "resident") {
          return (
            <Link
              to={`/admin/residentDetails/${row.original._id}`}
              className="font-bold text-blue-500 hover:underline"
            >
              More Info
            </Link>
          );
        } else {
          return (
            <Link
              to={`/admin/guestDetails/${row.original._id}`}
              className="font-bold text-blue-500 hover:underline"
            >
              More Info
            </Link>
          );
        }
      },
    },
    {
      Header: "Actions",
      Cell: ({ row }) => {
        if (row.original.isBlocked) {
          return (
            <button
              onClick={() => confirmUnblock(row.original._id)}
              className="bg-green-500 text-white p-2 rounded-md"
            >
              Unblock
            </button>
          );
        } else {
          return (
            <button
              onClick={() => confirmBlock(row.original._id)}
              className={`p-2 rounded-md ${
                row.original.role === "resident"
                  ? "bg-red-300 text-white cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
              disabled={row.original.role === "resident"}
            >
              Block
            </button>
          );
        }
      },
    },
    {
      Header: "Remove as Resident",
      Cell: ({ row }) => (
        <button
          onClick={() => confirmRemove(row.original._id)}
          className={`p-2 rounded-md ${
            row.original.role === "guest"
              ? "bg-red-300 text-white cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
          disabled={row.original.role === "guest"}
        >
          Remove
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
                User Management
              </h1>
            </div>
            <AdminTable columns={columns} data={users} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
