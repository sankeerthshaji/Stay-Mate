import React, { useState, useEffect } from "react";
import Loader from "../../components/user/Loader";
import { useSelector } from "react-redux";
import UserSideBar from "../../components/user/UserSideBar";
import UserTable from "../../components/user/UserTable";
import useLogout from "../../hooks/user/useLogout";
import axios from "../../axios/axios";
import UserModal from "../../components/user/UserModal";
import { ClipLoader } from "react-spinners";
import CustomInput from "../../components/user/CustomInput";
import { Formik, Form } from "formik";
import { leaveLetterSchema } from "../../schemas/leaveLetterSchema";
import CustomTextArea from "../../components/user/CustomTextArea";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function LeaveLetter() {
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const [leaveLetters, setLeaveLetters] = useState([]);
  const resident = useSelector((state) => state.resident);
  const { logout } = useLogout();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLeaveLetters();
  }, []);

  const fetchLeaveLetters = async () => {
    try {
      const userId = resident.id;
      const response = await axios.get("/leaveLetters", {
        params: { userId },
        headers: {
          Authorization: `Bearer ${resident.token}`,
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
          logout();
        }
      }
    } finally {
      setLoader(false);
    }
  };

  const columns = [
    {
      Header: "#",
      Cell: ({ row }) => row.index + 1,
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

  const handleClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/leaveLetters",
        {
          values,
          userId: resident.id,
        },
        {
          headers: {
            Authorization: `Bearer ${resident.token}`,
          },
        }
      );
      console.log(response.data.message);
      handleClose();
      fetchLeaveLetters();
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
        <div className="text-2xl font-bold">Submit Leave Letter</div>
        <Formik
          initialValues={{
            startDate: "",
            endDate: "",
            comments: "",
          }}
          validationSchema={leaveLetterSchema}
          onSubmit={handleSubmit}
        >
          <Form className="grid gap-5">
            <CustomInput
              label="Leave Start Date"
              name="startDate"
              id="Leave Start Date"
              placeholder="Select a date"
              type="date"
            />

            <CustomInput
              label="Leave End Date"
              name="endDate"
              id="Leave End Date"
              placeholder="Select a date"
              type="date"
            />

            <CustomTextArea
              label="Comments"
              name="comments"
              id="Comments"
              cols="30"
              rows="2"
            />

            <div className="flex flex-col gap-4">
              <button className="bg-blue-500 text-white p-2 rounded-md transform hover:scale-105 transition duration-300">
                {loading ? (
                  <ClipLoader size={20} color={"#fff"} />
                ) : (
                  "Update Menu"
                )}
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
            <UserSideBar />
          </div>
          <div className="flex-1 overflow-x-auto p-5 bg-gray-100">
            {showModal && modal}
            <div className="flex justify-between p-3">
              <h1 className="flex text-2xl font-bold text-center">
                Leave Letters
              </h1>
              <button
                onClick={handleClick}
                className="bg-gray-900 rounded-md text-white p-2"
              >
                Add Leave Letter
              </button>
            </div>
            <UserTable columns={columns} data={leaveLetters} />
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveLetter;
