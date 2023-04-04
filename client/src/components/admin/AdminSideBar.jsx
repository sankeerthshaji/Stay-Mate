import React, { useState } from "react";
import { Link } from "react-router-dom";
import control from "../../assets/img/control.png";
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

function AdminSideBar({ open, setOpen }) {
  const { logout } = useAdminLogout();
  const Menus = [
    { title: "Users", icons: <FaUsers size={20} />, route: "" },
    { title: "Rooms", icons: <MdOutlineMeetingRoom size={20} />, route: "" },
    { title: "Rent Payments", icons: <FaMoneyBill size={20} />, route: "" },
    { title: "Reviews ", icons: <MdReviews size={20} />, route: "" },
    { title: "Complaints", icons: <FaWpforms size={20} />, route: "" },
    { title: "Leave Letters ", icons: <BsEnvelope size={20} />, route: "" },
    {
      title: "Vacating Letters",
      icons: <SlEnvolopeLetter size={20} />,
      route: "",
    },
    {
      title: "Sales Report",
      icons: <HiOutlineDocumentReport size={20} />,
      route: "",
    },
    {
      title: "Logout",
      icons: <FiLogOut size={20} />,
      route: "",
      action: "logout",
    },
  ];

  function handleMenuClick(action) {
    if (action === "logout") {
      logout();
      toast.success("Logged out successfully.");
    }
  }

  return (
    <div className="flex">
      <div
        className={`w-20 lg:w-72 h-screen p-5 pt-8 bg-[#081A51] absolute duration-300 ${!open && "lg:w-20"}`}
      >
        <img
          src={control}
          onClick={() => setOpen(!open)}
          className={`hidden lg:block absolute cursor-pointer -right-3 top-9 w-7 border-2 border-[#081A51] rounded-full ${
            !open && "rotate-180"
          }`}
        />
        <div className="text-center">
          <h1
            className={`text-white origin-left font-bold text-3xl duration-300 cursor-pointer scale-0 lg:scale-100 ${!open && "lg:scale-0"}`}
          >
            staymate
          </h1>
        </div>
        <ul className="pt-8">
          {Menus.map((menu, index) => {
            return (
              <Link key={index} to={menu.route}>
                <li
                  onClick={() => handleMenuClick(menu.action)}
                  className={`text-gray-300 text-lg flex items-center gap-x-4 cursor-pointer p-2 py-4 hover:bg-[rgba(255,255,255,0.17)] rounded-md ${
                    index == 0 && "bg-[rgba(255,255,255,0.17)]"
                  }`}
                >
                  {menu.icons}
                  <span
                    className={`ml-3 hidden lg:${!open ? "hidden" : "block"} ${
                      !open && "hidden"
                    } origin-left duration-200`}
                  >
                    {menu.title}
                  </span>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default AdminSideBar;
