import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import OtpPage from "./pages/user/OtpPage";
import Admission from "./pages/user/admission";
import Rooms from "./pages/user/Rooms";
import Login from "./pages/user/LoginPage";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./components/user/Loader";
import ForgotPassword from "./pages/user/ForgotPassword";
import ChangePassword from "./pages/user/ChangePassword";
import AdminLogin from "./pages/admin/AdminLogin";
import Users from "./pages/admin/Users";
import BookRoomPage from "./pages/user/BookRoomPage";
import ConfirmationPage from "./pages/user/confirmationPage";

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
          <Route path="/roomTypes" element={<Rooms />} />
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
              !guest && !resident ? <Login /> : <Navigate to="/roomTypes" />
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
            path="/changePassword"
            element={
              !guest && !resident ? (
                <ChangePassword />
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
            element={resident ? <ConfirmationPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
