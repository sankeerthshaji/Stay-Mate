import React, { useEffect, useState } from "react";
import Loader from "../../components/user/Loader";
import { useSelector } from "react-redux";
import useLogout from "../../hooks/user/useLogout";
import UserSideBar from "../../components/user/UserSideBar";
import UserTable from "../../components/user/UserTable";
import UserModal from "../../components/user/UserModal";
import CustomSelect from "../../components/user/CustomSelect";
import { ClipLoader } from "react-spinners";
import { complaintSchema } from "../../schemas/complaintSchema";
import { Formik, Form } from "formik";
import CustomTextArea from "../../components/user/CustomTextArea";
import axios from "../../axios/axios";

function Complaint() {
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [errors, setErrors] = useState({});
  const resident = useSelector((state) => state.resident);
  const { logout } = useLogout();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const userId = resident.id;
      const response = await axios.get("/complaints", {
        params: { userId },
        headers: {
          Authorization: `Bearer ${resident.token}`,
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
          logout();
        }
      }
    } finally {
      setLoader(false);
    }
  };

  const handleClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const userId = resident.id;
      const response = await axios.post(
        "/complaints",
        { values, userId },
        {
          headers: {
            Authorization: `Bearer ${resident.token}`,
          },
        }
      );
      console.log(response.data);
      handleClose();
      fetchComplaints();
      Swal.fire({
        icon: "success",
        text: response.data.message,
      });
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
        <div className="text-2xl font-bold">Register a New Complaint</div>
        <Formik
          initialValues={{
            type: "",
            description: "",
          }}
          validationSchema={complaintSchema}
          onSubmit={handleSubmit}
        >
          <Form className="grid gap-5">
            <CustomSelect
              label="Complaint Type"
              name="type"
              errorMessage={errors?.type}
            >
              <option value="">Select a Complaint Type</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Security">Security</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Others">Others</option>
            </CustomSelect>

            <CustomTextArea
              label="Complaint Description"
              name="description"
              id="Complaint Description"
              cols="30"
              rows="2"
              errorMessage={errors?.description}
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

  const columns = [
    {
      Header: "#",
      Cell: ({ row }) => row.index + 1,
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
  ];

  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <div className="flex h-screen">
          <div className="w-16 flex-shrink-0">
            <UserSideBar />
          </div>
          <div className="flex-1 overflow-x-auto p-5 bg-gray-100">
            {showModal && modal}
            <div className="flex justify-between p-3">
              <h1 className="flex text-2xl font-bold text-center">
                Registered Complaints
              </h1>
              <button
                onClick={handleClick}
                className="bg-gray-900 rounded-md text-white p-2"
              >
                Add Complaint
              </button>
            </div>
            <UserTable columns={columns} data={complaints} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Complaint;
