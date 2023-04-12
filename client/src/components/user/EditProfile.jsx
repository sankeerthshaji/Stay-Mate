import React, { useState, useEffect } from "react";
import Avatar from "react-avatar-edit";
import CustomInput from "./CustomInput";
import { Form, Formik } from "formik";
import { ClipLoader } from "react-spinners";
import { profileSchema } from "../../schemas/profileSchema";
import useLogout from "../../hooks/user/useLogout";
import { useSelector } from "react-redux";
import axios from "../../axios/axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { toast } from "react-toastify";
import CustomSelect from "./CustomSelect";

function EditProfile() {
  const navigate = useNavigate();
  const resident = useSelector((state) => state.resident);
  const [userDetails, setUserDetails] = useState({});
  const [image, setImage] = useState(null);
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { logout } = useLogout();

  const handleTokenExpiration = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/userProfile/${resident.id}`, {
          headers: {
            Authorization: `Bearer ${resident.token}`,
          },
        });
        console.log(response.data.userDetails);
        setUserDetails(response.data.userDetails);
      } catch (err) {
        console.log(err);
        if (err.response && err.response.status === 401) {
          if (
            err.response.data.error === "Session timed out. Please login again."
          ) {
            // Handle "Session timed out" error
            handleTokenExpiration();
          }
        }
      } finally {
        setLoader(false);
      }
    };
    fetchUserDetails();
  }, [resident.id, resident.token]);

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
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
      console.log(imageFile);
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
    console.log("Form submitted");
    setLoading(true);

    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image); // assuming that `image` is a valid file object
      }
      formData.append("values", JSON.stringify(values));
      const response = await axios.patch(
        `/updateProfile/${resident.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${resident.token}`,
          },
        }
      );
      console.log(response);
      toast.success(response.data.message);
      navigate("/userProfile");
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
    <div className="flex-grow">
      {loader ? (
        <Loader />
      ) : (
        <div className="py-8 w-full bg-gray-50">
          <div className="text-center underline text-3xl font-bold">
            Edit Profile
          </div>
          <div className="px-12 py-6 sm:mx-auto sm:w-full">
            <div className="bg-white py-8 sm:shadow-2xl rounded-lg sm:px-10">
              <Formik
                initialValues={{
                  fullName: userDetails?.fullName,
                  dateOfBirth:
                    userDetails?.dateOfBirth &&
                    new Date(userDetails.dateOfBirth)
                      .toISOString()
                      .split("T")[0],
                  gender: userDetails?.gender,
                  mobileNumber: userDetails?.mobileNumber,
                  aadharNumber: userDetails?.aadharNumber,
                  parentName: userDetails?.parentName,
                  parentMobileNumber: userDetails?.parentMobileNumber,
                  bloodGroup: userDetails?.bloodGroup,
                  houseName: userDetails?.address?.houseName,
                  landmark: userDetails?.address?.landmark,
                  area: userDetails?.address?.area,
                  city: userDetails?.address?.city,
                  state: userDetails?.address?.state,
                  country: userDetails?.address?.country,
                  pincode: userDetails?.address?.pincode,
                }}
                validationSchema={profileSchema}
                onSubmit={handleSubmit}
              >
                <Form>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <CustomInput
                      label="FullName"
                      name="fullName"
                      id="FullName"
                      placeholder="Enter your full name"
                      type="text"
                      errorMessage={errors?.fullName}
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
                  </div>
                  <div className="flex justify-center py-16">
                    <Avatar
                      width={200}
                      height={200}
                      label={"Upload New photo"}
                      onFileLoad={handleFileLoad}
                      onCrop={handleFileLoad}
                      onClose={handleClose}
                    />
                  </div>

                  <div className="flex md:justify-end">
                    <button
                      className="bg-blue-700 hover:bg-blue-900 text-white font-bold w-full py-3 md:w-1/4 lg:w-1/6 rounded
                    transform hover:scale-110 transition duration-300"
                      type="submit"
                    >
                      {loading ? (
                        <ClipLoader size={28} color={"#fff"} />
                      ) : (
                        "Update"
                      )}
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;
