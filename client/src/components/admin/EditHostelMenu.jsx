import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import Loader from "../user/Loader";
import useAdminLogout from "../../hooks/admin/useAdminLogout";
import { useSelector } from "react-redux";
import axios from "../../axios/axios";
import { toast } from "react-toastify";

function EditHostelMenu() {
  const inputRef = useRef(null);
  const { id } = useParams(); // get the room ID from the URL params
  const admin = useSelector((state) => state.admin);
  const [menuDetails, setMenuDetails] = useState({});
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const { adminLogout } = useAdminLogout();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMenuDetails() {
      try {
        setLoader(true);
        const response = await axios.get(`/admin/hostelMenu/${id}`, {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        });
        console.log(response.data.menuDetails);
        setMenuDetails(response.data.menuDetails);
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
        inputRef?.current?.focus();
      }
    }
    fetchMenuDetails();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      console.log(menuDetails);
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
      console.log(response);
      toast.success(response.data.message);
      navigate("/admin/hostelMenu");
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 401) {
        if (
          err.response.data.error === "Session timed out. Please login again."
        ) {
          // Handle "Session timed out" error
          adminLogout();
        }
      } else {
        toast.error(err.response.data.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-grow">
      {loader ? (
        <Loader />
      ) : (
        <div className="flex justify-center h-screen items-center bg-gray-50">
          <div className="w-80 sm:w-96 shadow-2xl p-6 bg-white">
            <div className="grid gap-8">
              <div className="grid gap-2">
                <div className="text-2xl font-bold">
                  Edit {menuDetails?.day}'s Menu{" "}
                </div>
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
                  <button className="bg-blue-500 text-white p-2 rounded-md transform hover:scale-105 transition duration-300">
                    {loading ? (
                      <ClipLoader size={20} color={"#fff"} />
                    ) : (
                      "Update Menu"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditHostelMenu;
