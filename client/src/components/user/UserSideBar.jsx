import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { BiFoodMenu } from "react-icons/bi";
import { BsCreditCardFill } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { SlEnvolopeLetter } from "react-icons/sl";
import { BsEnvelope } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { TbHomeMove } from "react-icons/tb";
import useLogout from "../../hooks/user/useLogout";
import { toast } from "react-toastify";

function UserSideBar() {
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logout successfully");
  };
  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-gray-900 text-white shadow-lg">
      <Link to="/userProfile">
        <SideBarIcon icon={<FaUserCircle size="25" />} text="Profile" />
      </Link>
      <Link to="/hostelMenu">
        <SideBarIcon icon={<BiFoodMenu size="25" />} text="Hostel Menu" />
      </Link>
      <Link to="/rentDue">
        <SideBarIcon icon={<BsCreditCardFill size="25" />} text="Hostel Rent" />
      </Link>
      <Link to="/rentPaid">
        <SideBarIcon icon={<FaHistory size="25" />} text="Rent History" />
      </Link>
      <Link to="/review">
        <SideBarIcon icon={<MdReviews size="25" />} text="Review" />
      </Link>
      <Link to="/complaints">
        <SideBarIcon icon={<FaWpforms size="25" />} text="Complaints" />
      </Link>
      <Link to="/leaveLetters">
        <SideBarIcon
          icon={<SlEnvolopeLetter size="25" />}
          text="Leave Letter"
        />
      </Link>
      <Link to="/vacatingLetter">
        <SideBarIcon icon={<BsEnvelope size="25" />} text="Vacating Letter" />
      </Link>
      <Link to="/roomTypes">
        <SideBarIcon icon={<TbHomeMove size="25" />} text="Back to Home" />
      </Link>
      <SideBarIcon
        icon={<FiLogOut size="25" />}
        text="Logout"
        onClick={handleLogout}
      />
    </div>
  );
}

const SideBarIcon = ({ icon, text, onClick }) => {
  return (
    <div className="sidebar-icon group" onClick={onClick}>
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  );
};

export default UserSideBar;
