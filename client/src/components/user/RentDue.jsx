import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import useLogout from "../../hooks/user/useLogout";
import { useSelector } from "react-redux";
import axios from "../../axios/axios";
import { IoBedOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { toast } from "react-toastify";
import noRent from "../../assets/img/noRent.jpg";

function RentDue() {
  const [roomTypeDetails, setRoomTypeDetails] = useState({});
  const [rentDue, setRentDue] = useState({});
  const [loading, setLoading] = useState(false);
  const resident = useSelector((state) => state.resident);
  const { logout } = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRentDue(fetchRoomData());
  }, []);

  async function fetchRoomData() {
    try {
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
    }
  }

  const fetchRentDue = async () => {
    try {
      const userId = resident.id;
      const response = await axios.get("/rentDue", {
        params: { userId },
        headers: {
          Authorization: `Bearer ${resident.token}`,
        },
      });
      console.log(response);
      setRentDue(response.data.rentDue);
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
    }
  };

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

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/createRentOrder",
        {
          totalRent: rentDue?.rentAmount + rentDue?.fine,
        },
        {
          headers: {
            Authorization: `Bearer ${resident.token}`,
          },
        }
      );
      const order = response?.data?.order;
      console.log(order);

      let options = {
        key: "rzp_test_tN9rva6tbuI8ng", // Enter the Key ID generated from the Dashboard
        amount: order?.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "StayMate", //your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order?.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response) {
          // alert(response.razorpay_payment_id);
          // alert(response.razorpay_order_id);
          // alert(response.razorpay_signature);
          verifyPayment(response, order);
        },
        prefill: {
          name: "StayMate",
          email: "karmashoes@gmail.com",
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#235784",
        },
      };
      let rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        // alert(response.error.code);
        // alert(response.error.description);
        // alert(response.error.source);
        // alert(response.error.step);
        // alert(response.error.reason);
        // alert(response.error.metadata.order_id);
        // alert(response.error.metadata.payment_id);
        // navigate("/paymentFailed");
      });
      rzp1.open();
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 401) {
        if (
          err.response.data.error === "Session timed out. Please login again."
        ) {
          // Handle "Session timed out" error
          logout();
        } else if (err.response.data.error === "Request is not authorized") {
          // Handle "Request is not authorized" error
          toast.error("You are not authorized to perform this action.");
        }
      } else {
        toast.error(err.response.data.error || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  function verifyPayment(response, order) {
    axios
      .post(
        "/verifyRentPayment",
        {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          order,
          userId: resident?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${resident.token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          console.log(response.data);
          toast.success(response.data.message);
          navigate("/rentConfirmation");
        } else {
          toast.error("Payment Failed");
          // navigate("/paymentFailed");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          if (
            err.response.data.error === "Session timed out. Please login again."
          ) {
            // Handle "Session timed out" error
            logout();
          } else if (err.response.data.error === "Request is not authorized") {
            // Handle "Request is not authorized" error
            toast.error("You are not authorized to perform this action.");
          }
        } else {
          toast.error("Something went wrong");
        }
      });
  }

  return (
    <div className="flex-grow bg-gray-50">
      {Object.keys(rentDue).length > 0 ? (
        <div className="flex flex-col xl:flex-row justify-center gap-12 px-4 py-16 sm:px-20">
          <div className="shadow-lg xl:shadow-2xl md:w-full xl:w-6/12">
            <div className="w-full">
              <img src="https://html.merku.love/hosteller/img/room/01.webp" />
            </div>
            <div className="px-3 py-6 sm:px-6 xl:px-4 border-gray-500 grid gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold">
                  {roomTypeDetails.title}
                </h1>
              </div>

              <div className="flex-wrap text-gray-600 text-lg sm:text-xl">
                {roomTypeDetails.description}
              </div>

              <div className="flex flex-wrap text-gray-900">
                <div className="flex gap-1 items-center">
                  <div>
                    <FaRegUser />
                  </div>
                  <div>
                    {roomTypeDetails.capacity}{" "}
                    {roomTypeDetails.capacity === 1 ? "Sleep" : "Sleeps"}
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

          <div className="flex flex-col shadow-xl bg-[#e5ecee] gap-8">
            <div className="font-bold text-xl px-6 py-8 border-b border-[#bfbfbf]">
              Payment Summary
            </div>
            <div className="flex w-full justify-between px-8">
              <div className="sm:text-lg font-semibold">Rent Date</div>
              <div className="sm:text-lg font-semibold">
                {new Date(rentDue.rentDate).toLocaleDateString()}
              </div>
            </div>

            <div className="flex w-full justify-between px-8">
              <div className="sm:text-lg font-semibold">
                Last Date(Without Fine)
              </div>
              <div className="sm:text-lg font-semibold">
                {new Date(rentDue.lastDateWithoutFine).toLocaleDateString()}
              </div>
            </div>

            <div className="flex w-full justify-between px-8">
              <div className="sm:text-lg  font-semibold">
                Last Date(With Fine)
              </div>
              <div className="sm:text-lg font-semibold">
                {new Date(rentDue.lastDateWithFine).toLocaleDateString()}
              </div>
            </div>

            <div className="flex w-full justify-between px-8">
              <div className="sm:text-lg font-semibold">Rent Amount</div>
              <div className="sm:text-lg font-semibold">
                Rs.{rentDue.rentAmount}
              </div>
            </div>

            <div className="flex w-full justify-between px-8">
              <div className="sm:text-lg  font-semibold">Fine Amount</div>
              <div className="sm:text-lg font-semibold">Rs.{rentDue.fine}</div>
            </div>

            <div className="flex w-full justify-between px-8">
              <div className="sm:text-lg font-bold">Total Payment Amount</div>
              <div className="sm:text-lg font-semibold">
                Rs.{rentDue.rentAmount + rentDue.fine}
              </div>
            </div>

            <div className="px-10">
              <input type="checkbox" id="terms" defaultChecked />
              <label htmlFor="terms" className="text-sm px-4 font-semibold">
                I've read and accept the{" "}
                <span className="text-[#c5322d] font-bold">
                  terms & conditions*
                </span>
              </label>
            </div>

            <div className="flex justify-center mb-5">
              <button
                onClick={handlePayment}
                className="bg-[#235784] text-white w-5/6 py-2 font-bold text-lg rounded-md transform hover:scale-110 transition duration-300"
              >
                {loading ? (
                  <ClipLoader size={20} color={"#fff"} />
                ) : (
                  "Make Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-screen gap-5 bg-white">
          <div className="w-44">
            <img src={noRent} alt="" />
          </div>
          <div className="font-bold text-[#235784] text-3xl">No Rent Due</div>
          <div>
            <button className="bg-[#235784] text-white text-lg px-4 py-2 rounded-md transform hover:scale-105 transition duration-300">
              <Link to="/rentPaid">See Rent History</Link>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RentDue;
