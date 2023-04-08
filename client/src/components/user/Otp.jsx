import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Formik, useFormik } from "formik";
import axios from "../../axios/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export default function Otp() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData;
  const userImage = location.state?.userImage;
  const userEmail = location.state?.userEmail;

  useEffect(() => {
    if (
      !location.state?.userData &&
      !location.state?.userImage &&
      !location.state?.userEmail
    ) {
      navigate("/login", { replace: true });
    }
  }, [location.state, navigate]);

  const [loading, setLoading] = useState(false);
  const inputRef = useRef({});

  const validate = (values) => {
    const errors = {};
    if (values.otp.some((data) => data === "")) {
      errors.otp = "All fields are required";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      otp: Array.from({ length: 6 }).fill(""),
    },

    validate,
    onSubmit: async (values) => {
      console.log(values.otp.join(""));
      const otp = values.otp.join("");
      setLoading(true);
      try {
        const response = await axios.post("/verifyOtp", {
          otp,
          userData,
          userImage,
          userEmail,
        });
        console.log(response);
        toast.success(response?.data?.message);
        if (response?.data?.email) {
          navigate("/resetPassword", {
            state: { email: response?.data?.email },
          });
        } else {
          navigate("/login");
        }
      } catch (error) {
        toast.error(error?.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    inputRef.current[0].focus();

    const pasteText = (event) => {
      const pastedText = event.clipboardData.getData("text");
      const fieldValues = Array.from({ length: 6 }).fill("");
      pastedText.split("").forEach((value, index) => {
        fieldValues[index] = value;
      });
      formik.setValues({
        otp: fieldValues,
      });
      inputRef.current[fieldValues.length - 1].focus();
    };

    inputRef.current[0]?.addEventListener("paste", pasteText);

    return () => {
      inputRef.current[0]?.removeEventListener("paste", pasteText);
    };
  }, []);

  const handleChange = (event, index) => {
    const { value } = event.target;

    if (/[a-z]/gi.test(value)) return;

    const currentOTP = [...formik.values.otp];
    currentOTP[index] = value.slice(-1);
    formik.setValues((prev) => ({
      ...prev,
      otp: currentOTP,
    }));

    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (event, index) => {
    if (event.key === "Backspace") {
      if (index > 0) {
        inputRef.current[index - 1].focus();
      }
    }
  };

  const renderInput = () => {
    return formik.values.otp.map((value, index) => (
      <input
        key={index}
        ref={(element) => (inputRef.current[index] = element)}
        type="text"
        className="w-12 h-12 text-center text-xl rounded-md mr-2 sm:mr-6 bg-blue-200 border-blue-200"
        name={index}
        value={value}
        onChange={(event) => handleChange(event, index)}
        onKeyUp={(event) => handleBackspace(event, index)}
      />
    ));
  };

  return (
    <div className="mt-16 mb-20">
      <div className="text-center underline text-3xl font-bold">
        Email Verification
      </div>
      {userData && (
        <div>
          <div className="text-center text-xl mt-8">
            Please enter the verification code sent to
          </div>
          <div className="text-center text-xl font-bold">{userData?.email}</div>
        </div>
      )}
      {userEmail && (
        <div>
          <div className="text-center text-xl mt-8">
            Please enter the verification code sent to
          </div>
          <div className="text-center text-xl font-bold">{userEmail}</div>
        </div>
      )}
      <Formik>
        <div className="text-center mt-8">{renderInput()}</div>
      </Formik>
      {formik.errors.otp && (
        <p className="mt-4 text-center text-red-500">{formik.errors.otp}</p>
      )}
      <div className="text-center">
        <button
          type="button"
          className={`${
            formik.errors.otp ? "mt-5" : "mt-8"
          } w-32 bg-[#235784] px-3 py-2 text-white font-bold rounded-md transform hover:scale-110 transition duration-300`}
          onClick={formik.handleSubmit}
        >
          {loading ? <ClipLoader size={20} color={"#fff"} /> : "Submit"}
        </button>
      </div>
    </div>
  );
}
