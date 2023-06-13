import React, { useEffect, useRef, useState } from "react";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminTable from "../../components/admin/AdminTable";
import { useSelector } from "react-redux";
import axios from "../../axios/axios";
import useAdminLogout from "../../hooks/admin/useAdminLogout";
import AdminModal from "../../components/admin/AdminModal";
import ClipLoader from "react-spinners/ClipLoader";
import Loader from "../../components/user/Loader";
import { toast } from "react-toastify";

function AdminHostelMenu() {
  const [hostelMenu, setHostelMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const admin = useSelector((state) => state.admin);
  const { adminLogout } = useAdminLogout();
  const inputRef = useRef(null);
  const [menuDetails, setMenuDetails] = useState({});

  useEffect(() => {
    fetchHostelMenu();
  }, []);

  async function fetchHostelMenu() {
    try {
      const response = await axios.get("/admin/fetchHostelMenu", {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      setHostelMenu(response.data.hostelMenu);
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
  }

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
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <button
          onClick={() => {
            handleClick(row.original._id);
          }}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Edit
        </button>
      ),
    },
  ];

  const handleClick = (id) => {
    fetchMenuDetails(id);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  async function fetchMenuDetails(id) {
    setLoader(true);
    try {
      const response = await axios.get(`/admin/hostelMenu/${id}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      setMenuDetails(response.data.menuDetails);
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
      inputRef?.current?.focus();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const id = menuDetails._id;
      const response = await axios.put(
        `/admin/hostelMenu/${id}`,
        {
          menuDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );

      toast.success(response.data.message);
      handleClose();
      fetchHostelMenu();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle 401 errors
        adminLogout();
        console.error(err); // log the error message
      } else {
        // Handle other errors
        console.error(err); // log the error message
        toast.error(err.response.data.error || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }
  const modal = (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <AdminModal onClose={handleClose}>
          <div className="grid gap-4">
            <div className="text-2xl font-bold">
              Edit {menuDetails?.day}'s Menu{" "}
            </div>
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="breakfast"
                  className="text-sm font-medium text-gray-700"
                >
                  Breakfast
                </label>
                <input
                  className="w-full border-2 border-gray-300 p-2 rounded-md"
                  ref={inputRef}
                  type="text"
                  name="breakfast"
                  id="breakfast"
                  placeholder="Breakfast"
                  value={menuDetails?.breakfast}
                  onChange={(event) => {
                    setMenuDetails((prevMenuDetails) => {
                      return {
                        ...prevMenuDetails,
                        breakfast: event.target.value,
                      };
                    });
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="lunch"
                  className="text-sm font-medium text-gray-700"
                >
                  Lunch
                </label>
                <input
                  className="w-full border-2 border-gray-300 p-2 rounded-md"
                  type="text"
                  name="lunch"
                  id="lunch"
                  placeholder="Lunch"
                  value={menuDetails?.lunch}
                  onChange={(event) => {
                    setMenuDetails((prevMenuDetails) => {
                      return {
                        ...prevMenuDetails,
                        lunch: event.target.value,
                      };
                    });
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="snacks"
                  className="text-sm font-medium text-gray-700"
                >
                  Snacks
                </label>
                <input
                  className="w-full border-2 border-gray-300 p-2 rounded-md"
                  type="text"
                  name="snacks"
                  id="snacks"
                  placeholder="Snacks"
                  value={menuDetails?.snacks}
                  onChange={(event) => {
                    setMenuDetails((prevMenuDetails) => {
                      return {
                        ...prevMenuDetails,
                        snacks: event.target.value,
                      };
                    });
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="dinner"
                  className="text-sm font-medium text-gray-700"
                >
                  Dinner
                </label>
                <input
                  className="w-full border-2 border-gray-300 p-2 rounded-md"
                  type="text"
                  name="dinner"
                  id="dinner"
                  placeholder="Dinner"
                  value={menuDetails?.dinner}
                  onChange={(event) => {
                    setMenuDetails((prevMenuDetails) => {
                      return {
                        ...prevMenuDetails,
                        dinner: event.target.value,
                      };
                    });
                  }}
                />
              </div>

              <div className="flex flex-col gap-4">
                <button
                  className="bg-blue-500 text-white p-2 rounded-md transform hover:scale-105 transition duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader size={20} color={"#fff"} />
                  ) : (
                    "Update Menu"
                  )}
                </button>
              </div>
            </form>
          </div>
        </AdminModal>
      )}
      ;
    </div>
  );

  return (
    <div className="flex h-screen">
      <div className="w-16 flex-shrink-0">
        <AdminSideBar />
      </div>
      <div className="flex-1 overflow-x-auto">
        {loader ? (
          <Loader />
        ) : (
          <div className="p-5">
            {showModal && modal}
            <div className="flex justify-between p-3">
              <h1 className="flex text-2xl font-bold text-center">
                Hostel Menu
              </h1>
            </div>
            <AdminTable columns={columns} data={hostelMenu} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminHostelMenu;
