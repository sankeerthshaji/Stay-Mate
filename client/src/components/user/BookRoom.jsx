import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios/axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import useLogout from "../../hooks/user/useLogout";
import { FaRegUser } from "react-icons/fa";
import { IoBedOutline } from "react-icons/io5";

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

        setRoomData({
          details: response.data.roomDetails,
          dynamicRent: response.data.dynamicRent,
          totalRent: response.data.totalRent,
        });
      } catch (error) {
        console.error(error.message);
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

  const handlePayment = async () => {
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

      let options = {
        key: "rzp_test_tN9rva6tbuI8ng", // Enter the Key ID generated from the Dashboard
        amount: order?.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "StayMate", //your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order?.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response) {
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
        toast.error("Payment Failed");
        // navigate("/paymentFailed");
      });
      rzp1.open();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle 401 errors
        logout();
        navigate("/login");
        toast.error("Please login to continue");
        console.error(err); // log the error message
      } else if (err.response && err.response.status === 403) {
        // Handle 403 errors
        logout();
        navigate("/login");
        toast.error("Please login to continue");
        console.error(err); // log the error message
      } else {
        // Handle other errors
        console.error(err); // log the error message
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
          localStorage.removeItem("guest");
          dispatch({
            type: "GUEST_LOGOUT",
          });

          const { id, token, roomNo } = response.data;
          const json = { id, token };
          localStorage.setItem("resident", JSON.stringify(json));
          dispatch({
            type: "RESIDENT_LOGIN",
            payload: json,
          });

          toast.success(response.data.message);
          navigate("/confirmation", { state: { roomNo } });
        } else {
          toast.error("Payment Failed");
          // navigate("/paymentFailed");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          // Handle 401 errors
          logout();
          navigate("/login");
          toast.error("Please login to continue");
          console.error(err); // log the error message
        } else if (err.response && err.response.status === 403) {
          // Handle 403 errors
          logout();
          navigate("/login");
          toast.error("Please login to continue");
          console.error(err); // log the error message
        } else {
          // Handle other errors
          console.error(err); // log the error message
          toast.error("Payment failed");
        }
      });
  }

  return (
    <div>
      <div className="flex flex-col xl:flex-row justify-center gap-12 px-4 py-16 sm:px-20 sm:py-20 xl:py-24">
        <div className="shadow-lg xl:shadow-2xl md:w-full xl:max-w-xl">
          <div className="w-full">
            <img className="w-full object-cover" src={roomData?.details?.image?.url} />
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

            <div className="flex flex-wrap text-gray-900 text-xl gap-6">
              <div className="flex gap-2 items-center">
                <div>
                  <FaRegUser />
                </div>
                <div>
                  {roomData?.details?.capacity}{" "}
                  {roomData?.details?.capacity === 1 ? "Sleep" : "Sleeps"}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <div>
                  <IoBedOutline size={24} />
                </div>
                <div>{bedType}</div>
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

          {/* <div className="py-4 px-10">
            <input type="checkbox" id="terms" defaultChecked />
            <label htmlFor="terms" className="text-sm px-4 font-semibold">
              I've read and accept the{" "}
              <span className="text-[#c5322d] font-bold">
                terms & conditions*
              </span>
            </label>
          </div> */}

          <div className="flex justify-center py-7">
            <button
              onClick={handlePayment}
              className="bg-[#235784] text-white w-5/6 py-2 font-bold text-lg rounded-md transform hover:scale-110 transition duration-300"
              disabled={loading}
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
