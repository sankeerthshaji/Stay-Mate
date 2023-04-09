import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../../../hooks/user/useLogout";
import Button from "./Button";
import { toast } from "react-toastify";

function Navbar() {
  let links = [
    { name: "Home", link: "/roomTypes" },
    { name: "About", link: "/roomTypes" },
    { name: "Rooms", link: "/roomTypes" },
    { name: "Contacts", link: "/roomTypes" },
  ];

  let [open, setOpen] = useState(false);
  //to store current state of user
  const guest = useSelector((state) => state.guest);
  const resident = useSelector((state) => state.resident);
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logout successfully");
    navigate("/login");
    setOpen(false);
  };

  return (
    <div className="shadow-md w-full top-0 left-0">
      <div className="md:flex items-center justify-between bg-white py-5 lg:px-20 px-7">
        <div className="font-black text-3xl cursor-pointer flex items-center font-mono text-blue-900">
          <Link to="/">staymate</Link>
        </div>
        <div
          onClick={() => setOpen(!open)}
          className="lg:hidden text-3xl absolute right-8 top-6 cursor-pointer"
        >
          <ion-icon name={open ? "close" : "menu"}></ion-icon>
        </div>
        <ul
          className={`lg:flex lg:items-center lg:pb-0 pb-12 lg:static absolute bg-white lg:z-auto] 
        left-0 w-full lg:w-auto lg:pl-0 pl-9 transition-all duration-500 ease-in-out ${
          open ? "top-20" : "top-[-490px]"
        } lg:opacity-100`}
        >
          {links.map((link, index) => {
            return (
              <li key={link.name} className="lg:ml-16 text-xl lg:my-0 my-7">
                <Link
                  to={link.link}
                  className="text-black hover:text-blue-900 hover:underline"
                >
                  {link.name}
                </Link>
              </li>
            );
          })}

          {(guest || resident) && (
            <Button onClick={handleLogout}>Logout</Button>
          )}

          {(!guest && !resident) && (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
