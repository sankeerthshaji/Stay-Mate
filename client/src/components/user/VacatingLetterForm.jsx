import React, { useState } from "react";
import CustomTextArea from "./CustomTextArea";
import CustomInput from "./CustomInput";
import { Formik, Form } from "formik";
import { ClipLoader } from "react-spinners";
import { vacatingLetterSchema } from "../../schemas/vacatingLetterSchema";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import useLogout from "../../hooks/user/useLogout";
import axios from "../../axios/axios";
import { toast } from "react-toastify";

function VacatingLetterForm() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const resident = useSelector((state) => state.resident);
  const { logout } = useLogout();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/vacatingLetter",
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
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      }).then(() => {
        logout();
      });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle 401 errors
        logout();
        console.error(err); // log the error message
      } else if (err.response && err.response.status === 403) {
        // Handle 403 errors
        logout();
        console.error(err); // log the error message
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

  return (
    <div className="flex justify-center items-center h-screen">
      <section className="grid gap-4 p-6 w-72 sm:w-96 bg-white shadow-2xl">
        <div className="text-2xl font-bold">Submit Vacating Letter</div>
        <Formik
          initialValues={{
            departureDate: "",
            reason: "",
          }}
          validationSchema={vacatingLetterSchema}
          onSubmit={handleSubmit}
        >
          <Form className="grid gap-5">
            <CustomInput
              label="Departure Date"
              name="departureDate"
              id="Departure Date"
              placeholder="Select a date"
              type="date"
              errorMessage={errors?.departureDate}
            />

            <CustomTextArea
              label="Reason"
              name="reason"
              id="Reason"
              cols="30"
              rows="2"
              errorMessage={errors?.reason}
            />

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md transform hover:scale-105 transition duration-300"
              >
                {loading ? <ClipLoader size={20} color={"#fff"} /> : "Submit"}
              </button>
            </div>
          </Form>
        </Formik>
      </section>
    </div>
  );
}

export default VacatingLetterForm;
