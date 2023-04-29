import React from "react";
import ForgotPasswordForm from "../../components/user/ForgotPasswordForm";
import Footer from "../../components/user/Footer/Footer";
import Navbar from "../../components/user/Navbar/Navbar";

function ForgotPassword() {
  return (
    <>
      <Navbar />
      <ForgotPasswordForm />
      <Footer />
    </>
  );
}

export default ForgotPassword;
