import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axios/axios";
import Swal from "sweetalert2"
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import useLogout from "../../hooks/user/useLogout";

function ChangePasswordForm() {
  const resident = useSelector((state) => state.resident);
  const inputRef = useRef(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { logout } = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleTokenExpiration = () => {
    logout();
    navigate("/login");
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/changePassword/${resident.id}`,
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${resident.token}`,
          },
        }
      );
      Swal.fire({
        icon: 'success',
        text: response.data.message,
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            navigate("/userProfile");
        }
    });
    } catch (err) {
      if (err.response && err.response.status === 401) {
       // Handle 401 error
       logout();
       console.error(err)
      } else {
        Swal.fire({
          icon: 'error',
          text: err.response.data.error || "Something went wrong",
          confirmButtonText: 'OK',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: true
      });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex-grow">
      <section className="flex justify-center items-center h-screen bg-gray-50">
        <div className="p-6 shadow-2xl bg-white grid gap-7">
          <div className="grid gap-2">
            <h1 className="text-xl lg:text-2xl font-medium">Choose a new password.</h1>
            <span className="text-sm break-words">
              Create a new password that is at least 8 characters long.
            </span>
          </div>
            <input
              ref={inputRef}
              className="w-full rounded-md p-2"
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <input
              className="w-full rounded-md p-2"
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              className="w-full rounded-md p-2"
              type="password"
              name="confirmPassword"
              placeholder="Retype New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleClick}
              className="w-full bg-[#3b5998] text-white py-2 rounded-md transform hover:scale-105 transition duration-300"
            >
              {loading ? <ClipLoader size={20} color={"#fff"} /> : "Submit"}
            </button>
        </div>
      </section>
    </div>
  );
}

export default ChangePasswordForm;
