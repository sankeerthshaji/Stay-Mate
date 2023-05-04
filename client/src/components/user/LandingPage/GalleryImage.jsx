import React from "react";

export default function GalleryImage({ img }) {
  return (
    <div className="overflow-hidden rounded-lg hover:cursor-pointer">
      <img
        src={img}
        className="transform hover:scale-110 transition duration-700"
      ></img>
    </div>
  );
}
