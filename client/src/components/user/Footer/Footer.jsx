import React from "react";
import { Icons, Links } from "./Menus";
import SocialIcons from "./SocialIcons";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Footer() {
  const location = useLocation();
  const resident = useSelector((state) => state.resident);
  return (
    <footer className="bg-blue-900 text-white ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-32 sm:px-32 px-5 py-16">
        <div>
          <h1 className="mb-1 font-bold text-3xl">staymate</h1>
          <p className="pt-3 text-lg flex flex-wrap">
            Ut tellus elementum sagittis vitae et leo duis ut. Sit amet
            consectetur adipiscing elit duis. Ultrices gravida dictum fusce ut
            placer orci nulla pellentesque
          </p>
        </div>
        <div>
          <h1 className="mb-1 font-bold text-2xl">Quick Links</h1>
          {Links.map((link, index) => {
            const isActive = location.pathname === link.link;
            const activeClass = isActive
              ? "pt-3 font-bold text-lg underline"
              : "pt-3 font-bold text-lg hover:underline duration-300";
            if (link.name === "Login" && resident) {
              return (
                <p key={index} className={activeClass}>
                  <a href="/userProfile">Account</a>
                </p>
              );
            } else {
              return (
                <p key={index} className={activeClass}>
                  <a href={link.link}>{link.name}</a>
                </p>
              );
            }
          })}
        </div>
        <div>
          <h1 className="mb-1 font-bold text-3xl">Contact Us</h1>
          <div>
            <div>
              <p className="justify-evenly flex-wrap font-semibold text-lg inline-flex gap-5 mt-8">
                <span className="text-3xl">
                  <ion-icon name="location-outline"></ion-icon>
                </span>
                (329) 580-7077 <br />
                (650) 382-5020
              </p>
            </div>
            <div>
              <p className="justify-evenly flex-wrap font-semibold text-lg inline-flex gap-5 mt-8">
                <span className="text-3xl">
                  <ion-icon name="call-outline"></ion-icon>
                </span>
                (329) 580-7077 <br />
                (650) 382-5020
              </p>
            </div>
          </div>
        </div>
        <div>
          <h1 className="mb-1 font-bold text-3xl">Follow Us</h1>
          <p className="pt-3 text-lg">
            Venenatis urna cursus eget nunc scelerisque
          </p>
          <SocialIcons Icons={Icons} />
        </div>
      </div>
      <div className="bg-white text-blue-900 text-center py-7 text-base">
        <span>Copyrights © 2023 All rights reserved </span>
      </div>
    </footer>
  );
}

export default Footer;
