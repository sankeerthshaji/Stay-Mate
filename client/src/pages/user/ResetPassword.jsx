import React from "react";
import ResetPasswordForm from "../../components/user/ResetPasswordForm";
import Footer from "../../components/user/Footer/Footer";
import Navbar from "../../components/user/Navbar/Navbar";

function ResetPassword() {
  return (
    <>
      <Navbar />
      <ResetPasswordForm />
      <Footer />
    </>
  );
}

export default ResetPassword;
