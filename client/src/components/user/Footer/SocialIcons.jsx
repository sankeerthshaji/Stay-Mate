import React from "react";
import { Icons } from "./Menus";

function SocialIcons({ Icons }) {
  return (
    <div>
      {Icons.map((icon, index) => {
        return (
          <span
            key={index}
            className="mt-8 cursor-pointer inline-flex items-center
                rounded-full mx-2 text-2xl
                duration-300 "
          >
            <ion-icon name={icon.name}></ion-icon>
          </span>
        );
      })}
    </div>
  );
}

export default SocialIcons;
