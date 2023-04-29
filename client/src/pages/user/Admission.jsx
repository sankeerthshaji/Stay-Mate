import React from "react";
import Footer from "../../components/user/Footer/Footer";
import Navbar from "../../components/user/Navbar/Navbar";
import AdmissionForm from "../../components/user/admissionForm";

function Admission() {
  return (
    <div>
      <Navbar />
      <AdmissionForm />
      <Footer />
    </div>
  );
}

export default Admission;
