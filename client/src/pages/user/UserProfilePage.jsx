import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useLogout from "../../hooks/user/useLogout";
import axios from "../../axios/axios";
import Loader from "../../components/user/Loader";
import UserSideBar from "../../components/user/UserSideBar";
import UserProfile from "../../components/user/UserProfile";
import UserModal from "../../components/user/UserModal";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function UserProfilePage() {
  const resident = useSelector((state) => state.resident);
  const [userDetails, setUserDetails] = useState({});
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { logout } = useLogout();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    setLoader(true);
    try {
      const response = await axios.get(`/userProfile/${resident.id}`, {
        headers: {
          Authorization: `Bearer ${resident.token}`,
        },
      });
      setUserDetails(response.data.userDetails);
      fetchAvailableRoomTypes();
      console.log(response.data.userDetails);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle 401 errors
        logout();
        console.error(err); // log the error message
      } else {
        // Handle other errors
        console.error(err); // log the error message
      }
    }
  };

  async function fetchAvailableRoomTypes() {
    try {
      const response = await axios.get("/availableRoomTypes", {
        headers: {
          Authorization: `Bearer ${resident.token}`,
        },
      });
      setRoomTypes(response.data.availableRoomTypes);
      console.log(response.data.availableRoomTypes);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle 401 errors
        logout();
        console.error(err); // log the error message
      } else {
        // Handle other errors
        console.error(err); // log the error message
      }
    } finally {
      setLoader(false);
    }
  }

  const onClick = () => {
    setShowModal(true);
  };

  const onClose = () => {
    setShowModal(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "/assignNewRoomType",
        {
          userId: resident.id,
          roomNo: userDetails.roomNo,
          newRoomTypeId: e.target.type.value,
        },
        {
          headers: {
            Authorization: `Bearer ${resident.token}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.status) {
        Swal.fire({
          title: "Room Type Changed!",
          text: `You have successfully changed the room type to ${response.data.newRoomType}! Please note that the changes will take effect starting next month.`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          fetchUserDetails();
        });
      }else{
        Swal.fire({
          icon: 'warning',
          title: 'You have selected the same room type',
          text: 'Please select a different room type.',
        });
      }
      setShowModal(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle 401 errors
        logout();
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

  const modal = (
    <UserModal onClose={onClose}>
      <div className="grid gap-4">
        <div className="text-2xl font-bold">Choose a Room Type</div>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
            <select name="type" id="type">
              <option value="">Select a Room Type</option>
              {roomTypes.map((roomType) => (
                <option value={roomType._id}>{roomType.name}</option>
              ))}
            </select>
            <button
              className="bg-blue-500 text-white p-2 rounded-md transform hover:scale-105 transition duration-300"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color={"#fff"} /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </UserModal>
  );

  return (
    <div className="flex h-screen">
      <div className="w-16 flex-shrink-0">
        <UserSideBar />
      </div>
      <div className="flex-grow bg-gray-50">
        {loader ? (
          <Loader />
        ) : (
          <div>
            {showModal && modal}
            <UserProfile userDetails={userDetails} onClick={onClick} />
          </div>
        )}
      </div>
    </div>
  );
}
