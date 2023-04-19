import React, { useEffect, useState } from "react";
import Loader from "../../components/user/Loader";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminTable from "../../components/admin/AdminTable";
import { useSelector } from "react-redux";
import axios from "../../axios/axios";
import useAdminLogout from "../../hooks/admin/useAdminLogout";
import { Formik, Form } from "formik";
import UserModal from "../../components/user/UserModal";
import CustomSelect from "../../components/user/CustomSelect";
import CustomTextArea from "../../components/user/CustomTextArea";
import { ClipLoader } from "react-spinners";
import { adminComplaintSchema } from "../../schemas/adminComplaintSchema";
import { toast } from "react-toastify";

function Complaints() {
  const admin = useSelector((state) => state.admin);
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [complaintDetails, setComplaintDetails] = useState({});
  const { adminLogout } = useAdminLogout();
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchLeaveLetters();
  }, []);

  const fetchLeaveLetters = async () => {
    try {
      const response = await axios.get("/admin/complaints", {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
      console.log(response.data.complaints);
      setComplaints(response.data.complaints);
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
      Header: "Complaint Type",
      Cell: ({ row }) => row.original.type,
    },
    {
      Header: "Complaint Description",
      Cell: ({ row }) => row.original.description,
    },
    {
      Header: "Status",
      Cell: ({ row }) => (
        <p
          className={`${
            row.original.status === "New"
              ? "text-blue-500"
              : row.original.status === "In Progress"
              ? "text-yellow-400"
              : "text-green-500"
          }`}
        >
          {row.original.status}
        </p>
      ),
    },
    {
      Header: "Created At",
      Cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      Header: "Admin Response",
      Cell: ({ row }) => row.original.adminResponse,
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <div className="flex justify-center">
          <button
            onClick={() => handleClick(row.original._id)}
            className={`p-2 rounded ${
              row.original.status === "Resolved"
                ? "cursor-not-allowed bg-green-300 text-white"
                : "bg-green-500 text-white  hover:bg-green-600"
            }`}
            disabled={row.original.status === "Resolved"}
          >
            Update
          </button>
        </div>
      ),
    },
  ];

  const handleClick = (id) => {
    fetchComplaint(id);
    setShowModal(true);
  };

  const fetchComplaint = async (id) => {
    setLoader(true);
    try {
      const response = await axios.get(`/admin/complaint/${id}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
      console.log(response.data.complaint);
      setComplaintDetails(response.data.complaint);
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

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `/admin/complaint/${complaintDetails._id}`,
        {
          values,
        },
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );
      console.log(response.data);
      toast.success(response.data.message);
      fetchLeaveLetters();
      setShowModal(false);
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 401) {
        if (
          err.response.data.error === "Session timed out. Please login again."
        ) {
          // Handle "Session timed out" error
          logout();
        }
      } else if (err.response && err.response.status === 422) {
        if (err?.response?.data?.errors) {
          setErrors(err.response.data.errors);
        }
      } else {
        // Handle any other unknown errors
        toast.error(err.response.data.error || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const modal = (
    <UserModal onClose={handleClose}>
      <div className="grid gap-4">
        <div className="text-2xl font-bold">Update Complaint Status</div>
        <Formik
          initialValues={{
            status: complaintDetails?.status,
            adminResponse: complaintDetails?.adminResponse,
          }}
          validationSchema={adminComplaintSchema}
          onSubmit={handleSubmit}
        >
          <Form className="grid gap-5">
            <CustomSelect
              label="Complaint Status"
              name="status"
              errorMessage={errors?.status}
            >
              {/* <option value="">Select a status</option> */}
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </CustomSelect>

            <CustomTextArea
              label="Admin Response"
              name="adminResponse"
              id="Admin Response"
              cols="30"
              rows="2"
              errorMessage={errors?.adminResponse}
            />

            <div className="flex flex-col gap-4">
              <button className="bg-blue-500 text-white p-2 rounded-md transform hover:scale-105 transition duration-300">
                {loading ? <ClipLoader size={20} color={"#fff"} /> : "Submit"}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </UserModal>
  );

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
            {showModal && modal}
            <div className="flex justify-between p-3">
              <h1 className="flex text-2xl font-bold text-center">
                Complaint Management
              </h1>
            </div>
            <AdminTable columns={columns} data={complaints} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Complaints;
