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
      <SideBarIcon icon={<FaUsers size="25" />} text="Users" link="/admin"/>
      <SideBarIcon
        icon={<MdOutlineMeetingRoom size="25" />}
        text="Rooms"
        link="/admin/rooms"
      />
      <SideBarIcon
        icon={<BiFoodMenu size="25" />}
        text="Hostel Menu"
        link="/admin/hostelMenu"
      />
      <SideBarIcon
        icon={<FaMoneyBill size="25" />}
        text="Rent"
        link="/admin/paidRents"
        link2="/admin/unpaidRents"
      />
      <SideBarIcon
        icon={<MdReviews size="25" />}
        text="Reviews"
        link="/admin/reviews"
      />
      <SideBarIcon
        icon={<FaWpforms size="25" />}
        text="Complaints"
        link="/admin/complaints"
      />
      <SideBarIcon
        icon={<SlEnvolopeLetter size="25" />}
        text="Leave letters"
        link="/admin/leaveLetters"
      />
      <SideBarIcon
        icon={<BsEnvelope size="25" />}
        text="Vacating letters"
        link="/admin/vacatingLetters"
      />
      <SideBarIcon
        icon={<FiLogOut size="25" />}
        text="Logout"
        onClick={handleLogout}
      />
    </div>
  );
}

const SideBarIcon = ({ icon, text, onClick, link, link2 }) => {
  const isActive =
    location.pathname === link || location.pathname === link2
  const activeClass = isActive
    ? "sidebar-icon-active group"
    : "sidebar-icon group";
  return (
    <Link to={link}>
      <div className={activeClass} onClick={onClick}>
        {icon}
        <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
      </div>
    </Link>
  );
};

export default AdminSideBar;
