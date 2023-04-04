import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../axios/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleClick = async () => {
    try {
      setLoading(true)
      const response = await axios.post("/forgotPassword", { email });
      setError("");
      toast.success(response.data.message);
      navigate("/otp", {
        state: {
          userEmail: response.data.email,
        },
      });
    } catch (err) {
      setError(err.response.data.error);
      //   toast.error(error.response.data.error || "Something went wrong");
    } finally {
      setLoading(false)
    }
  };
  return (
    <section className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-96 p-6 shadow-2xl bg-white grid gap-7">
        <div className=" grid gap-2">
          <h1 className="text-4xl font-medium">Forgot Password?</h1>
          <p>Reset Password in two quick steps</p>
        </div>
        <div>
          <input
            ref={inputRef}
            className={`w-full ${error ? "border-red-500 border-2" : ""}`}
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && (
            <p className="text-red-600 text-sm font-medium mt-1">{error}</p>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={handleClick}
            className="w-full bg-[#3b5998] text-white py-2 rounded-md transform hover:scale-105 transition duration-300"
          >
            {loading ? <ClipLoader size={20} color={"#fff"} /> : "Reset Password"}
          </button>
        </div>
        <div className="text-center">
          <Link to="/login">
            <button className="text-center p-3 hover: text-gray-600 hover:bg-slate-100 hover:underline hover:text-black rounded-full">
              Back to Login
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ForgotPasswordForm;
