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
      console.log(response.data.users);
      setUsers(response.data.users);
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 401) {
        if (
          err.response.data.error === "Session timed out. Please login again."
        ) {
          // Handle "Session timed out" error
          adminLogout();
        } else if (err.response.data.error === "Request is not authorized") {
          // Handle "Request is not authorized" error
          toast.error("You are not authorized to perform this action.");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const blockUser = async (id) => {
    if (!window.confirm("Are you sure you want to block this user?")) {
      return;
    }
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
      console.log(response.data);
      logout();
      toast.success("User blocked successfully");
      fetchUsers();
    } catch (err) {
      console.log(err);
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
    if (
      !window.confirm("Are you sure you want to unblock this user?")
    ) {
      return;
    }
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
      console.log(response.data);
      toast.success("User unblocked successfully");
      fetchUsers();
    } catch (err) {
      console.log(err);
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
    if (
      !window.confirm("Are you sure you want to remove this user as resident?")
    ) {
      return;
    }
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
      console.log(response.data);
      logout();
      fetchUsers();
      toast.success("User removed as resident successfully");
    } catch (err) {
      console.log(err);
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
    // {
    //   Header: "More Details",
    //   Cell: ({ row }) => (
    //     <Link to="" className="font-bold text-blue-500 hover:underline">
    //       More Info
    //     </Link>
    //   ),
    // },
    {
      Header: "Actions",
      Cell: ({ row }) => {
        if (row.original.isBlocked) {
          return (
            <button
              onClick={() => unblockUser(row.original._id)}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Unblock
            </button>
          );
        } else {
          return (
            <button
              onClick={() => blockUser(row.original._id)}
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
          onClick={() => removeAsResident(row.original._id)}
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
        <div className="flex">
          <AdminSideBar/>
        </div>
      )}
    </div>
  );
}

export default Users;
