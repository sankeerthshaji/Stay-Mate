import React, { useEffect, useState } from "react";
import "./stars.css";
import { FaRegUser } from "react-icons/fa";
import { IoBedOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import axios from "../../../axios/axios";
import Loader from "../Loader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Form, Formik } from "formik";
import { reviewSchema } from "../../../schemas/reviewSchema";
import CustomTextArea from "../CustomTextArea";
import useLogout from "../../../hooks/user/useLogout";

function Review() {
  const [roomTypeDetails, setRoomTypeDetails] = useState({});
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const resident = useSelector((state) => state.resident);
  const [review, setReview] = useState({});
  const { logout } = useLogout();

  useEffect(() => {
    fetchRoomData();
    fetchReview();
  }, []);

  async function fetchRoomData() {
    try {
      setLoader(true);
      const roomNo = resident?.roomNo;
      const response = await axios.get("/roomTypeDetails", {
        params: { roomNo },
        headers: {
          Authorization: `Bearer ${resident.token}`,
          // add any additional headers here
        },
      });
      console.log(response.data);
      setRoomTypeDetails(response.data.roomTypeDetails);
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
  }

  async function fetchReview() {
    try {
      setLoader(true);
      const response = await axios.get(`/hostelReview/${resident.id}`, {
        headers: {
          Authorization: `Bearer ${resident.token}`,
        },
      });
      console.log(response.data);
      setReview(response.data.hostelReview);
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
  }

  let bedType = null;

  switch (roomTypeDetails?.capacity) {
    case 1:
      bedType = "Single Bed";
      break;
    case 2:
      bedType = "2 Single Bed";
      break;
    case 4:
      bedType = "1 Bunk Bed";
      break;
    case 6:
      bedType = "2 Bunk Bed";
      break;
    default:
      break;
  }

  const handleSubmit = async (values) => {
    console.log(values);
    setLoading(true);
    try {
      // update the rating value based on the checked radio button
      const selectedRating = document.querySelector(
        'input[name="rating"]:checked'
      ).value;
      values.rating = selectedRating;
      const response = await axios.post(
        "/hostelReview",
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
      console.log(response.data);
      toast.success(response.data.message);
      fetchReview();
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

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`/hostelReview/${id}`, {
        headers: {
          Authorization: `Bearer ${resident.token}`,
        },
      });
      console.log(response.data);
      toast.success(response.data.message);
      fetchReview();
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
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete the review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {loader ? (
        <Loader />
      ) : (
        <div className="flex flex-col justify-center md:flex-row gap-3">
          <div className="border-solid border-2 border-gray-200 md:w-1/2 xl:w-1/3">
            <div>
              <img src="https://html.merku.love/hosteller/img/room/01.webp" />
            </div>
            <div className="px-5 py-4 border-gray-500 grid gap-2.5">
              <div>
                <h1 className="text-xl font-semibold">
                  {roomTypeDetails?.title}
                </h1>
              </div>

              <div className="flex-wrap text-gray-600">
                {roomTypeDetails?.description}
              </div>

              <div className="flex flex-wrap text-gray-900">
                <div className="flex gap-2 items-center">
                  <div>
                    <FaRegUser />
                  </div>
                  <div>
                    {roomTypeDetails?.capacity}{" "}
                    {roomTypeDetails?.capacity === 1 ? "Sleep" : "Sleeps"}
                  </div>
                </div>

                <div className="flex gap-2 items-center px-6">
                  <div>
                    <IoBedOutline size={24} />
                  </div>
                  <div>{bedType}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 md:w-1/3">
            <h2 className="mb-3 text-2xl font-semibold">
              Leave a Review about the Hostel
            </h2>
            <Formik
              initialValues={{
                rating: 1,
                body: "",
              }}
              validationSchema={reviewSchema}
              onSubmit={handleSubmit}
            >
              <Form>
                <div>
                  {/* <CustomInput
                    label="Rating"
                    name="rating"
                    id="Rating"
                    type="range"
                    min={1}
                    max={5}
                    errorMessage={errors?.rating}
                  /> */}
                  <fieldset class="starability-growRotate">
                    <input
                      type="radio"
                      id="no-rate"
                      class="input-no-rate"
                      name="rating"
                      value="1"
                      checked
                      aria-label="No rating."
                    />
                    <input
                      type="radio"
                      id="first-rate1"
                      name="rating"
                      value="1"
                    />
                    <label for="first-rate1" title="Terrible">
                      1 star
                    </label>
                    <input
                      type="radio"
                      id="first-rate2"
                      name="rating"
                      value="2"
                    />
                    <label for="first-rate2" title="Not good">
                      2 stars
                    </label>
                    <input
                      type="radio"
                      id="first-rate3"
                      name="rating"
                      value="3"
                    />
                    <label for="first-rate3" title="Average">
                      3 stars
                    </label>
                    <input
                      type="radio"
                      id="first-rate4"
                      name="rating"
                      value="4"
                    />
                    <label for="first-rate4" title="Very good">
                      4 stars
                    </label>
                    <input
                      type="radio"
                      id="first-rate5"
                      name="rating"
                      value="5"
                    />
                    <label for="first-rate5" title="Amazing">
                      5 stars
                    </label>
                  </fieldset>
                </div>
                <div className="mb-3">
                  <CustomTextArea
                    label="Review Text"
                    name="body"
                    id="Review Text"
                    cols="30"
                    rows="3"
                    errorMessage={errors?.body}
                  />
                </div>
                <div className="mb-3">
                  <button
                    type="submit"
                    className={`px-2 py-1 text-sm font-semibold bg-green-600 text-white rounded-sm hover:bg-green-700${
                      loading && "cursor-not-allowed"
                    }`}
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </Form>
            </Formik>

            {review && (
              <>
                <h1 className="text-xl font-semibold mb-3">Your Review</h1>
                <div className="p-3 mb-3 border-2">
                  <div>
                    {/* <h1 className="font-semibold mb-3">
                      Rating: {review.rating}
                    </h1> */}
                    <p
                      className="starability-result mb-3"
                      data-rating={review.rating}
                    >
                      {`Rated: ${review.rating} stars`}
                    </p>
                    <p className="text-sm mb-3">Review: {review.body}</p>
                    <div>
                      <button
                        onClick={() => confirmDelete(review._id)}
                        className={`px-2 py-1 text-sm font-semibold bg-red-600 text-white rounded-sm hover:bg-red-700 ${
                          loading && "cursor-not-allowed"
                        }`}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Review;
