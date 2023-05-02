import React, { useState, useEffect } from "react";
import useAdminLogout from "../../hooks/admin/useAdminLogout";
import axios from "../../axios/axios";
import Loader from "../../components/user/Loader";
import AdminSideBar from "../../components/admin/AdminSideBar";
import { useSelector } from "react-redux";
import AdminTable from "../../components/admin/AdminTable";
import Swal from "sweetalert2";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loader, setLoader] = useState(false);
  const admin = useSelector((state) => state.admin);
  const { adminLogout } = useAdminLogout();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoader(true);
      const response = await axios.get("/admin/reviews", {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      setReviews(response.data.reviews);
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

  const handleApprove = async (id) => {
    try {
      setLoader(true);
      const response = await axios.put(
        `/admin/reviews/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );

      fetchReviews();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle 401 errors
        adminLogout();
        console.error(err); // log the error message
      } else {
        // Handle other errors
        console.error(err); // log the error message
        toast.error("Something went wrong");
      }
    } finally {
      setLoader(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoader(true);
      const response = await axios.put(
        `/admin/reviews/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );

      fetchReviews();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle 401 errors
        adminLogout();
        console.error(err); // log the error message
      } else {
        // Handle other errors
        console.error(err); // log the error message
        toast.error("Something went wrong");
      }
    } finally {
      setLoader(false);
    }
  };

  const confirmApprove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Approve this Review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22C55E",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleApprove(id);
      }
    });
  };

  const confirmReject = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Reject this Review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleReject(id);
      }
    });
  };

  const columns = [
    {
      Header: "User",
      Cell: ({ row }) => row.original.user.fullName,
    },
    {
      Header: "Rating",
      Cell: ({ row }) => row.original.rating,
    },
    {
      Header: "Review Text",
      Cell: ({ row }) => row.original.body,
    },
    {
      Header: "Status",
      Cell: ({ row }) => (
        <p
          className={
            row.original.status === "Pending"
              ? "text-yellow-400"
              : row.original.status === "Approved"
              ? "text-green-500"
              : "text-red-500"
          }
        >
          {row.original.status}
        </p>
      ),
    },
    {
      Header: "Approve",
      Cell: ({ row }) => (
        <button
          onClick={() => confirmApprove(row.original._id)}
          className={`text-white p-2 rounded ${
            row.original.status === "Approved"
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={row.original.status === "Approved"}
        >
          Approve
        </button>
      ),
    },
    {
      Header: "Reject",
      Cell: ({ row }) => (
        <button
          onClick={() => confirmReject(row.original._id)}
          className={`text-white p-2 rounded ${
            row.original.status === "Rejected"
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
          disabled={row.original.status === "Rejected"}
        >
          Reject
        </button>
      ),
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
              <h1 className="flex text-2xl font-bold text-center">Reviews</h1>
            </div>
            <AdminTable columns={columns} data={reviews} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews;
