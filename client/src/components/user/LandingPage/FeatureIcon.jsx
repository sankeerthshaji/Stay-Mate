import React from "react";

export default function FeatureIcon({ icon, text }) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:gap-2">
      {icon}
      <p className="mt-2 text-gray-600 font-semibold">{text}</p>
    </div>
  );
}
