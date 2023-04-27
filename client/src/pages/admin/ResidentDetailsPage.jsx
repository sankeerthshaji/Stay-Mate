import React, { useEffect, useState } from "react";
import AdminSideBar from "../../components/admin/AdminSideBar";
import ResidentDetails from "../../components/admin/ResidentDetails";
import AdminModal from "../../components/admin/AdminModal";
import { ClipLoader } from "react-spinners";
import useAdminLogout from "../../hooks/admin/useAdminLogout";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "../../axios/axios";
import Loader from "../../components/user/Loader";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

function ResidentDetailsPage() {
  const { id } = useParams();
  const admin = useSelector((state) => state.admin);
  const [residentDetails, setResidentDetails] = useState({});
  const [roomTypeDetails, setRoomTypeDetails] = useState({});
  const [rooms, setRooms] = useState([]);
  const [formattedDateOfBirth, setFormattedDateOfBirth] = useState("");
  const [loader, setLoader] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { adminLogout } = useAdminLogout();

  useEffect(() => {
    fetchResidentDetails();
  }, [id, admin.token]);

  const fetchResidentDetails = async () => {
    try {
      const response = await axios.get(`/admin/residentDetails/${id}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      setResidentDetails(response.data.residentDetails);
      setRoomTypeDetails(response.data.roomTypeDetails);
      fetchRooms(response.data.roomTypeDetails._id);

      // Format date of birth
      const dateStr = response.data.residentDetails.dateOfBirth;
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      setFormattedDateOfBirth(formattedDate);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle 401 errors
        adminLogout();
        console.error(err); // log the error message
      } else {
        // Handle other errors
        console.error(err); // log the error message
      }
    }
  };

  const fetchRooms = async (roomTypeId) => {
    try {
      const response = await axios.get(`/admin/rooms/${roomTypeId}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      setRooms(response.data.rooms);
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
  };

  const onClick = () => {
    if (rooms.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `No rooms available for ${roomTypeDetails?.name} room type`,
      });
      return;
    }
    setShowModal(true);
  };

  const onClose = () => {
    setShowModal(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const newRoomId = formData.get("type");
    try {
      const response = await axios.patch(
        "/admin/assignRoom",
        {
          oldRoomNo: residentDetails.roomNo,
          newRoomId,
          residentId: residentDetails._id,
        },
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );
      if (response.data.status) {
        fetchResidentDetails();
      }
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Room No changed successfully!",
      });
      setShowModal(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle 401 errors
        adminLogout();
        console.error(err); // log the error message
      } else {
        toast.error(err.response.data.error || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const modal = (
    <AdminModal onClose={onClose}>
      <div className="grid gap-4">
        <div className="text-2xl font-bold">Choose a Room No</div>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
            <select name="type" id="type">
              <option value="">Select a Room No</option>
              {rooms.map((room) => (
                <option value={room._id}>{room.roomNo}</option>
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
    </AdminModal>
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
          {showModal && modal}
          <div className="flex-grow bg-gray-50">
            <ResidentDetails
              onClick={onClick}
              residentDetails={residentDetails}
              roomTypeDetails={roomTypeDetails}
              formattedDateOfBirth={formattedDateOfBirth}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ResidentDetailsPage;
