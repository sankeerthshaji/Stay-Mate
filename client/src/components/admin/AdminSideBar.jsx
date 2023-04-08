import React from "react";
import { FaUsers } from "react-icons/fa";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { SlEnvolopeLetter } from "react-icons/sl";
import { BsEnvelope } from "react-icons/bs";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import useAdminLogout from "../../hooks/admin/useAdminLogout";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

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
      <SideBarIcon icon={<MdOutlineMeetingRoom size="25" />} text="Rooms" />
      <SideBarIcon icon={<FaMoneyBill size="25" />} text="Rent" />
      <SideBarIcon icon={<MdReviews size="25" />} text="Reviews" />
      <SideBarIcon icon={<FaWpforms size="25" />} text="Complaints" />
      <SideBarIcon icon={<SlEnvolopeLetter size="25" />} text="Leave letters" />
      <SideBarIcon icon={<BsEnvelope size="25" />} text="Vacating letters" />
      <SideBarIcon
        icon={<HiOutlineDocumentReport size="25" />}
        text="Sales Report"
      />
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
