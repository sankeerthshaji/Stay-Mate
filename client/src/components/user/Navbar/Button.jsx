import React from "react";

function Button(props) {
  return (
    <button
      className="bg-blue-100 text-blue-900 py-2 px-6 rounded text-xl lg:ml-16"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
