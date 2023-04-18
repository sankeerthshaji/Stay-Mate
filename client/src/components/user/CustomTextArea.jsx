import React from "react";
import { useField } from "formik";

function CustomTextArea({ label, errorMessage, ...props }) {
  const [field, meta] = useField(props);
  const showError = meta.touched && (meta.error || errorMessage);
  return (
    <div>
      <label htmlFor={label} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <textarea
          {...field}
          {...props}
          className={`w-full rounded-lg shadow-sm ${
            showError ? "border-red-500 border-2" : ""
          }`}
        />
      </div>
      {showError ? (
        <p className="text-red-500 mt-1">{meta.error || errorMessage}</p>
      ) : null}
    </div>
  );
}

export default CustomTextArea;
