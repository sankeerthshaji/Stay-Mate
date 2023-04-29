import React from "react";
import { FaUsers } from "react-icons/fa";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { SlEnvolopeLetter } from "react-icons/sl";
import { BsEnvelope } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import useAdminLogout from "../../hooks/admin/useAdminLogout";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { BiFoodMenu } from "react-icons/bi";

function AdminSideBar() {
  const { adminLogout } = useAdminLogout();

  const handleLogout = () => {
    adminLogout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-gray-900 text-white shadow-lg">
      <Link to="/admin">
        <SideBarIcon icon={<FaUsers size="25" />} text="Users" />
      </Link>
      <Link to="/admin/rooms">
        <SideBarIcon icon={<MdOutlineMeetingRoom size="25" />} text="Rooms" />
      </Link>
      <Link to="/admin/hostelMenu">
        <SideBarIcon icon={<BiFoodMenu size="25" />} text="Hostel Menu" />
      </Link>
      <Link to="/admin/paidRents">
        <SideBarIcon icon={<FaMoneyBill size="25" />} text="Rent" />
      </Link>
      <Link to="/admin/reviews">
        <SideBarIcon icon={<MdReviews size="25" />} text="Reviews" />
      </Link>
      <Link to="/admin/complaints">
        <SideBarIcon icon={<FaWpforms size="25" />} text="Complaints" />
      </Link>
      <Link to="/admin/leaveLetters">
        <SideBarIcon
          icon={<SlEnvolopeLetter size="25" />}
          text="Leave letters"
        />
      </Link>
      <Link to="/admin/vacatingLetters">
        <SideBarIcon icon={<BsEnvelope size="25" />} text="Vacating letters" />
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

export default AdminSideBar;
