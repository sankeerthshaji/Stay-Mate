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

function AdminSideBar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-gray-900 text-white shadow-lg">
      <SideBarIcon icon={<FaUsers size="25" />} text="Users" />
      <SideBarIcon icon={<MdOutlineMeetingRoom size="25" />} text="Rooms" />
      <SideBarIcon icon={<FaMoneyBill size="25" />} text="Rent" />
      <SideBarIcon icon={<MdReviews size="25" />} text="Reviews" />
      <SideBarIcon icon={<FaWpforms size="25" />} text="Complaints" />
      <SideBarIcon icon={<SlEnvolopeLetter size="25" />} text="Leave letters" />
      <SideBarIcon icon={<BsEnvelope size="25" />} text="Vacating letters" />
      <SideBarIcon icon={<HiOutlineDocumentReport size="25" />} text="Sales Report" />
      <SideBarIcon icon={<FiLogOut size="25" />} text="Logout" />
    </div>
  );
}

const SideBarIcon = ({ icon, text }) => {
  return (
    <div className="sidebar-icon group">
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">
        {text}
      </span>
    </div>
  );
};

export default AdminSideBar;