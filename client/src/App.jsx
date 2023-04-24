import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import OtpPage from "./pages/user/OtpPage";
import Admission from "./pages/user/Admission";
import Login from "./pages/user/LoginPage";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./components/user/Loader";
import ForgotPassword from "./pages/user/ForgotPassword";
import AdminLogin from "./pages/admin/AdminLogin";
import Users from "./pages/admin/Users";
import BookRoomPage from "./pages/user/BookRoomPage";
import ConfirmationPage from "./pages/user/confirmationPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import EditProfilePage from "./pages/user/EditProfilePage";
import ResetPassword from "./pages/user/ResetPassword";
import ChangePassword from "./pages/user/ChangePassword";
import HostelMenu from "./pages/user/HostelMenu";
import AdminHostelMenu from "./pages/admin/AdminHostleMenu";
import RoomTypes from "./pages/user/RoomTypes";
import Rooms from "./pages/admin/Rooms";
import ReviewPage from "./pages/user/ReviewPage";
import Reviews from "./pages/admin/Reviews";
import LeaveLetter from "./pages/user/LeaveLetter";
import LeaveLetters from "./pages/admin/LeaveLetters";
import Complaint from "./pages/user/Complaint";
import Complaints from "./pages/admin/Complaints";
import RentDuePage from "./pages/user/RentDuePage";
import RentPaid from "./pages/user/RentPaid";
import RentConfirmationPage from "./pages/user/RentConfirmationPage";
import PaidRents from "./pages/admin/PaidRents";
import UnpaidRents from "./pages/admin/UnpaidRents";
import RentPaymentChecker from "./components/user/RentPaymentChecker";
import GuestDetailsPage from "./pages/admin/GuestDetailsPage";
import ResidentDetailsPage from "./pages/admin/ResidentDetailsPage";

function App() {
  const [loading, setLoading] = useState(true);
  const guest = useSelector((state) => state.guest);
  const resident = useSelector((state) => state.resident);
  const admin = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    const guest = JSON.parse(localStorage.getItem("guest"));
    const resident = JSON.parse(localStorage.getItem("resident"));
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (guest) {
      dispatch({ type: "GUEST_LOGIN", payload: guest });
    }
    if (resident) {
      dispatch({ type: "RESIDENT_LOGIN", payload: resident });
    }
    if (admin) {
      dispatch({ type: "ADMIN_LOGIN", payload: admin });
    }
    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/roomTypes" element={<RoomTypes />} />
          <Route
            path="/admission"
            element={
              !guest && !resident ? <Admission /> : <Navigate to="/roomTypes" />
            }
          />
          <Route path="/otp" element={<OtpPage />} />

          <Route
            path="/login"
            element={
              !guest && !resident ? (
                <Login />
              ) : guest && !resident ? (
                <Navigate to="/roomTypes" />
              ) : !guest && resident ? (
                <Navigate to="/userProfile" />
              ) : null // handle the case where both guest and resident are present, or neither is present
            }
          />

          <Route
            path="/forgotPassword"
            element={
              !guest && !resident ? (
                <ForgotPassword />
              ) : (
                <Navigate to="/roomTypes" />
              )
            }
          />
          <Route
            path="/resetPassword"
            element={
              !guest && !resident ? (
                <ResetPassword />
              ) : (
                <Navigate to="/roomTypes" />
              )
            }
          />

          <Route path="/bookRoom/:id" element={<BookRoomPage />} />

          <Route
            path="/admin/login"
            element={!admin ? <AdminLogin /> : <Navigate to="/admin" />}
          />

          <Route
            path="/admin"
            element={admin ? <Users /> : <Navigate to="/admin/login" />}
          />

          <Route
            path="/confirmation"
            element={
              resident ? (
                <RentPaymentChecker>
                  <ConfirmationPage />
                </RentPaymentChecker>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/userProfile"
            element={
              resident ? (
                <RentPaymentChecker>
                  <UserProfilePage />
                </RentPaymentChecker>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/editProfile"
            element={
              resident ? (
                <RentPaymentChecker>
                  <EditProfilePage />
                </RentPaymentChecker>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/changePassword"
            element={
              resident ? (
                <RentPaymentChecker>
                  <ChangePassword />
                </RentPaymentChecker>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/admin/residentDetails/:id"
            element={
              admin ? <ResidentDetailsPage/> : <Navigate to="/admin/login" />
            }
          />

          <Route
            path="/admin/guestDetails/:id"
            element={
              admin ? <GuestDetailsPage /> : <Navigate to="/admin/login" />
            }
          />

          <Route
            path="/hostelMenu"
            element={
              resident ? (
                <RentPaymentChecker>
                  <HostelMenu />
                </RentPaymentChecker>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/admin/hostelMenu"
            element={
              admin ? <AdminHostelMenu /> : <Navigate to="/admin/login" />
            }
          />

          <Route
            path="/admin/rooms"
            element={admin ? <Rooms /> : <Navigate to="/admin/login" />}
          />

          <Route
            path="/review"
            element={
              resident ? (
                <RentPaymentChecker>
                  <ReviewPage />
                </RentPaymentChecker>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/admin/reviews"
            element={admin ? <Reviews /> : <Navigate to="/admin/login" />}
          />

          <Route
            path="/leaveLetters"
            element={
              resident ? (
                <RentPaymentChecker>
                  <LeaveLetter />
                </RentPaymentChecker>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/admin/leaveLetters"
            element={admin ? <LeaveLetters /> : <Navigate to="/admin/login" />}
          />

          <Route
            path="/complaints"
            element={
              resident ? (
                <RentPaymentChecker>
                  <Complaint />
                </RentPaymentChecker>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/admin/complaints"
            element={admin ? <Complaints /> : <Navigate to="/admin/login" />}
          />

          <Route
            path="/rentDue"
            element={
              resident ? (
                <RentPaymentChecker>
                  <RentDuePage />
                </RentPaymentChecker>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/rentPaid"
            element={
              resident ? (
                <RentPaymentChecker>
                  <RentPaid />
                </RentPaymentChecker>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/rentConfirmation"
            element={
              resident ? (
                <RentPaymentChecker>
                  <RentConfirmationPage />
                </RentPaymentChecker>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/admin/paidRents"
            element={admin ? <PaidRents /> : <Navigate to="/admin/login" />}
          />

          <Route
            path="/admin/unpaidRents"
            element={admin ? <UnpaidRents /> : <Navigate to="/admin/login" />}
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
