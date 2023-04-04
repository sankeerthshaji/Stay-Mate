import React from "react";
import Footer from "../../components/user/Footer/Footer";
import Navbar from "../../components/user/Navbar/Navbar";
import Otp from "../../components/user/Otp";

function OtpPage() {
  return (
    <div>
      <Navbar />
        <Otp/>
      <Footer />
    </div>
  );
}

export default OtpPage;
