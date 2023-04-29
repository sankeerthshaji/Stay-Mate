import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../axios/axios";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";

function ResetPasswordForm() {
  const inputRef = useRef(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();
    if (!location.state?.email) {
      navigate("/login", { replace: true });
    }
  }, [location.state, navigate]);

  const handleClick = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/resetPassword", {
        email,
        password,
        confirmPassword,
      });
      Swal.fire({
        icon: "success",
        text: response.data.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err.response.data.error || "Something went wrong",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-6 shadow-2xl bg-white grid gap-7">
        <div className="grid gap-2">
          <h1 className="text-2xl font-medium">Choose a new password.</h1>
          <span className="text-sm whitespace-nowrap">
            Create a new password that is at least 8 characters long.
          </span>
        </div>
        <div>
          <input
            ref={inputRef}
            className="w-full rounded-md p-2"
            type="password"
            name="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            className="w-full rounded-md p-2"
            type="password"
            name="password"
            placeholder="Retype New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button
            type="button"
            onClick={handleClick}
            className="w-full bg-[#3b5998] text-white py-2 rounded-md transform hover:scale-105 transition duration-300"
          >
            {loading ? <ClipLoader size={20} color={"#fff"} /> : "Submit"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ResetPasswordForm;
