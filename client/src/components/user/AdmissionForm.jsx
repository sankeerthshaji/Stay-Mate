import axios from "../../axios/axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "react-avatar-edit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Formik } from "formik";
import { admissionSchema } from "../../schemas/admissionSchema";
import CustomInput from "./CustomInput";
import CustomSelect from "./CustomSelect";
import { ClipLoader } from "react-spinners";

function AdmissionForm() {
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const handleFileLoad = (initialImage, croppedImage) => {
    const finalImage = croppedImage || initialImage;

    const imageFile =
      typeof finalImage === "string"
        ? dataURLtoFile(finalImage, "profile.jpg")
        : finalImage;

    if (imageFile) {
      setImage(imageFile);
    } else {
      toast.error("Please select an image.");
    }
  };

  // handle on close event
  const handleClose = () => {
    // Clear the image state if the modal is closed
    setImage(null);
  };

  const handleSubmit = async (values, actions) => {
    if (!image) {
      return toast.error("Please select an image.");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("values", JSON.stringify(values));

      const response = await axios.post("/admission", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const userData = response.data.values;
      const userImage = response.data.file;
      toast.success(response.data.message);
      navigate("/otp", { state: { userData, userImage } });
    } catch (error) {
      if (error?.response && error?.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error?.response?.data?.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16">
      <div className="text-center underline text-3xl font-bold">
        Application for hostel admission
      </div>
      <div className="px-12 py-6 sm:mx-auto sm:w-full">
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
          <Formik
            initialValues={{
              fullName: "",
              email: "",
              password: "",
              confirmPassword: "",
              dateOfBirth: "",
              gender: "",
              mobileNumber: "",
              aadharNumber: "",
              parentName: "",
              parentMobileNumber: "",
              bloodGroup: "",
              houseName: "",
              landmark: "",
              area: "",
              city: "",
              state: "",
              country: "",
              pincode: "",
            }}
            validationSchema={admissionSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-9">
                <CustomInput
                  label="FullName"
                  name="fullName"
                  id="FullName"
                  placeholder="Enter your full name"
                  type="text"
                  errorMessage={errors?.fullName}
                />

                <CustomInput
                  label="Email"
                  name="email"
                  id="Email"
                  placeholder="Enter your email"
                  type="email"
                  errorMessage={errors?.email}
                />

                <CustomInput
                  label="Password"
                  name="password"
                  id="Password"
                  placeholder="Enter your password"
                  type="password"
                  errorMessage={errors?.password}
                />

                <CustomInput
                  label="Confirm Password"  
                  name="confirmPassword"
                  id="Confirm Password"
                  placeholder="Enter your password again"
                  type="password"
                  errorMessage={errors?.confirmPassword}
                />

                <CustomInput
                  label="Date of Birth"
                  name="dateOfBirth"
                  id="Date of Birth"
                  type="date"
                  errorMessage={errors?.dateOfBirth}
                />

                <CustomSelect
                  label="Gender"
                  name="gender"
                  errorMessage={errors?.gender}
                >
                  <option value="">Please select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </CustomSelect>

                <CustomInput
                  label="Mobile Number"
                  name="mobileNumber"
                  id="Mobile Number"
                  placeholder="Enter your mobile number"
                  type="tel"
                  errorMessage={errors?.mobileNumber}
                />

                <CustomInput
                  label="Aadhar Number"
                  name="aadharNumber"
                  id="Aadhar Number"
                  placeholder="Enter your Aadhar number"
                  type="number"
                  errorMessage={errors?.aadharNumber}
                />

                <CustomInput
                  label="Parent Name"
                  name="parentName"
                  id="Parent Name"
                  placeholder="Enter your Parent's name"
                  type="tel"
                  errorMessage={errors?.parentName}
                />

                <CustomInput
                  label="Parent Mobile Number"
                  name="parentMobileNumber"
                  id="Parent Mobile Number"
                  placeholder="Enter your Parent's mobile number"
                  type="tel"
                  errorMessage={errors?.parentMobileNumber}
                />

                <CustomSelect
                  label="Blood Group"
                  name="bloodGroup"
                  errorMessage={errors?.bloodGroup}
                >
                  <option value="">Please select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </CustomSelect>

                <CustomInput
                  label="House Name"
                  name="houseName"
                  id="House Name"
                  placeholder="Enter your house name"
                  type="text"
                  errorMessage={errors?.houseName}
                />

                <CustomInput
                  label="Area"
                  name="area"
                  id="Area"
                  placeholder="Enter your area"
                  type="text"
                  errorMessage={errors?.area}
                />

                <CustomInput
                  label="Landmark"
                  name="landmark"
                  id="Landmark"
                  placeholder="Enter your landmark"
                  type="text"
                  errorMessage={errors?.landmark}
                />

                <CustomInput
                  label="City"
                  name="city"
                  id="City"
                  placeholder="Enter your city"
                  type="text"
                  errorMessage={errors?.city}
                />

                <CustomInput
                  label="State"
                  name="state"
                  id="State"
                  placeholder="Enter your state"
                  type="text"
                  errorMessage={errors?.state}
                />

                <CustomInput
                  label="Country"
                  name="country"
                  id="Country"
                  placeholder="Enter your country"
                  type="text"
                  errorMessage={errors?.country}
                />

                <CustomInput
                  label="Pincode"
                  name="pincode"
                  id="Pincode"
                  placeholder="Enter your pincode"
                  type="text"
                  errorMessage={errors?.pincode}
                />

                {/* <CustomSelect
                    label="Room Type"
                    name="roomType"
                    errorMessage={errors?.roomType}
                  >
                    <option value="">Please select Room Type</option>
                    {roomTypes.map((roomType) => (
                      <option key={roomType._id} value={roomType._id}>
                        {roomType.title}
                      </option>
                    ))}
                  </CustomSelect> */}

                {/* <CustomSelect
                  label="Current Education Status"
                  name="currentEducationStatus"
                  errorMessage={errors?.currentEducationStatus}
                >
                  <option value="">Select an option</option>
                  <option value="currently_studying">
                    Candidate currently studying
                  </option>
                  <option value="not_currently_studying">
                    Candidate not currently studying
                  </option>
                </CustomSelect> */}

              </div>
              <div className="flex justify-center py-16">
                <Avatar
                  width={200}
                  height={200}
                  label={"Upload a photo"}
                  onFileLoad={handleFileLoad}
                  onCrop={handleFileLoad}
                  onClose={handleClose}
                />
              </div>

              <div className="flex md:justify-end pt-8">
                <button
                  className="bg-blue-700 hover:bg-blue-900 text-white font-bold w-full py-3 md:w-1/4 lg:w-1/6 rounded
                    transform hover:scale-110 transition duration-300"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={28} color={"#fff"} /> : "Submit"}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default AdmissionForm;
