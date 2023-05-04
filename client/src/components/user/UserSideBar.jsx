import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logout successfully");
  };
  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-gray-900 text-white shadow-lg">
      <SideBarIcon
        icon={<FaUserCircle size="25" />}
        text="Profile"
        link="/userProfile"
      />
      <SideBarIcon
        icon={<BiFoodMenu size="25" />}
        text="Hostel Menu"
        link="/hostelMenu"
      />
      <SideBarIcon
        icon={<BsCreditCardFill size="25" />}
        text="Hostel Rent"
        link="/rentDue"
      />
      <SideBarIcon
        icon={<FaHistory size="25" />}
        text="Rent History"
        link="/rentPaid"
      />
      <SideBarIcon
        icon={<MdReviews size="25" />}
        text="Review"
        link="/review"
      />
      <SideBarIcon
        icon={<FaWpforms size="25" />}
        text="Complaints"
        link="/complaints"
      />
      <SideBarIcon
        icon={<SlEnvolopeLetter size="25" />}
        text="Leave Letter"
        link="/leaveLetters"
      />
      <SideBarIcon
        icon={<BsEnvelope size="25" />}
        text="Vacating Letter"
        link="/vacatingLetter"
      />
      <SideBarIcon
        icon={<TbHomeMove size="25" />}
        text="Back to Home"
        link="/"
      />
      <SideBarIcon
        icon={<FiLogOut size="25" />}
        text="Logout"
        onClick={handleLogout}
      />
    </div>
  );
}

const SideBarIcon = ({ icon, text, onClick, link }) => {
  const isActive = location.pathname === link;
  const activeClass = isActive
    ? "sidebar-icon-active group"
    : "sidebar-icon group";
  return (
    <Link to={link}>
      <div className={activeClass} onClick={onClick}>
        {icon}
        <span
          className="sidebar-tooltip group-hover:scale-100"
        >
          {text}
        </span>
      </div>
    </Link>
  );
};

export default UserSideBar;
