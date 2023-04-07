import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { BiFoodMenu } from "react-icons/bi";
import { BsCreditCardFill } from "react-icons/bs";
import { MdReviews } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { SlEnvolopeLetter } from "react-icons/sl";
import { BsEnvelope } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../../hooks/user/useLogout";

function UserSideBar() {
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };
  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-gray-900 text-white shadow-lg">
      <Link to="/userProfile">
        <SideBarIcon icon={<FaUserCircle size="25" />} text="Profile" />
      </Link>
      <Link to="/hostelMenu">
        <SideBarIcon icon={<BiFoodMenu size="25" />} text="Hostel Menu" />
      </Link>
      <Link to="/userProfile">
        <SideBarIcon icon={<BsCreditCardFill size="25" />} text="Hostel Rent" />
      </Link>
      <Link to="/userProfile">
        <SideBarIcon icon={<MdReviews size="25" />} text="Review" />
      </Link>
      <Link to="/userProfile">
        <SideBarIcon icon={<FaWpforms size="25" />} text="Complaints" />
      </Link>
      <Link to="/userProfile">
        <SideBarIcon
          icon={<SlEnvolopeLetter size="25" />}
          text="Leave Letter"
        />
      </Link>
      <Link to="/userProfile">
        <SideBarIcon icon={<BsEnvelope size="25" />} text="Vacating Letter" />
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
    <div
      className="relative flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto
    bg-gray-800 text-blue-300 hover:bg-blue-600  
    hover:text-white rounded-3xl hover:rounded-xl transition-all duration-300 ease-linear cursor-pointer group"
      onClick={onClick}
    >
      {icon}
      <span className="absolute w-auto p-2 m-2 min-w-max left-14 
    rounded-md shadow-md text-white bg-gray-900 
    text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100">{text}</span>
    </div>
  );
};

export default UserSideBar;
