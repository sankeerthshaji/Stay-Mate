import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios/axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import useLogout from "../../hooks/user/useLogout";
import store from "../../redux/store";

function BookRoom() {
  const { id } = useParams(); // get the room ID from the URL params
  const [roomData, setRoomData] = useState({
    details: {},
    dynamicRent: null,
    totalRent: null,
  });
  const [loading, setLoading] = useState(false);
  const guest = useSelector((state) => state.guest);
  const resident = useSelector((state) => state.resident);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentDate = new Date();
  const rentMonthYear = currentDate.toLocaleString("en-us", {
    month: "long",
    year: "numeric",
  });
  const { logout } = useLogout();

  useEffect(() => {
    async function fetchRoomData() {
      try {
        const response = await axios.get(`/roomDetails/${id}`);
        console.log(response.data);
        setRoomData({
          details: response.data.roomDetails,
          dynamicRent: response.data.dynamicRent,
          totalRent: response.data.totalRent,
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchRoomData();
  }, [id]);

  let bedType = null;

  switch (roomData?.details?.capacity) {
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

  const handleTokenExpiration = () => {
    logout();
    toast.error("Your session has expired. Please log in again.");
    navigate("/login");
  };

  const handlePayment = async () => {
    console.log(store.getState());
    try {
      setLoading(true);
      if (resident) {
        toast.error("You have already booked a room");
        return;
      }
      if (!guest) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }
      const response = await axios.post(
        "/createBookingOrder",
        {
          totalRent: roomData?.totalRent,
          roomTypeId: id,
          userId: guest?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${guest.token}`,
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
          handleTokenExpiration();
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
        "/verifyBookingPayment",
        {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          order,
          userId: guest.id,
          roomTypeId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${guest.token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          console.log(response.data);

          localStorage.removeItem("guest");
          dispatch({
            type: "GUEST_LOGOUT",
          });

          const { id, roomNo, token } = response.data;
          const json = { id, roomNo, token };
          localStorage.setItem("resident", JSON.stringify(json));
          dispatch({
            type: "RESIDENT_LOGIN",
            payload: json,
          });

          toast.success(response.data.message);
          navigate("/confirmation");
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
            handleTokenExpiration();
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
    <div>
      <div className="flex flex-col xl:flex-row justify-center gap-12 px-4 py-16 sm:px-20 sm:py-20 xl:py-24">
        <div className="shadow-lg xl:shadow-2xl md:w-full xl:w-6/12">
          <div className="w-full">
            <img src="https://html.merku.love/hosteller/img/room/01.webp" />
          </div>
          <div className="px-3 py-6 sm:px-6 xl:px-4 border-gray-500 grid gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">
                {roomData?.details?.title}
              </h1>
            </div>

            <div className="flex-wrap text-gray-600 text-lg sm:text-xl">
              {roomData?.details?.description}
            </div>

            <div className="flex flex-wrap text-gray-900 text-xl">
              <div className="flex items-center">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
                <div>
                  {roomData?.details?.capacity}{" "}
                  {roomData?.details?.capacity === 1 ? "Sleep" : "Sleeps"}
                </div>
              </div>

              <div className="flex gap-2 items-center px-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                  />
                </svg>
                {bedType}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col shadow-xl bg-[#e5ecee]">
          <div className="font-bold text-xl px-6 py-8 border-b border-[#bfbfbf]">
            Payment Summary
          </div>
          <div className="flex justify-between py-5">
            <div className="sm:text-lg px-6 font-semibold">Monthly Rent</div>
            <div className="sm:text-lg px-12 font-semibold">
              Rs.{roomData?.details?.rent}
            </div>
          </div>

          <div className="flex justify-between py-5">
            <div className="sm:text-lg px-6 font-semibold">
              Rent for {rentMonthYear}
            </div>
            <div className="sm:text-lg px-12 font-semibold">
              Rs.{roomData?.dynamicRent}
            </div>
          </div>

          <div className="flex justify-between py-5">
            <div className="sm:text-lg px-6 font-semibold">Admission Fees</div>
            <div className="sm:text-lg px-12 font-semibold">Rs.1000</div>
          </div>

          <div className="flex justify-between py-5">
            <div className="sm:text-lg px-6 font-bold">
              Total Payment Amount
            </div>
            <div className="sm:text-lg px-12 font-bold">
              Rs.{roomData?.totalRent}
            </div>
          </div>

          <div className="py-4 px-10">
            <input type="checkbox" id="terms" defaultChecked />
            <label htmlFor="terms" className="text-sm px-4 font-semibold">
              I've read and accept the{" "}
              <span className="text-[#c5322d] font-bold">
                terms & conditions*
              </span>
            </label>
          </div>

          <div className="flex justify-center py-7">
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

          <div className="flex justify-center pb-8">
            <button className="bg-blue-300 text-blue-900 w-5/6 py-2 font-bold text-lg rounded-md transform hover:scale-110 transition duration-300">
              <Link to="/roomTypes">Go Back</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookRoom;
