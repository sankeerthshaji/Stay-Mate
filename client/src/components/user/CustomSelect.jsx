import React from "react";
import { useField } from "formik";

export default function CustomSelect({ label, errorMessage, ...props }) {
  const [field, meta] = useField(props);
  const showError = meta.touched && (meta.error || errorMessage);

  return (
    <div>
      <label htmlFor={label} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <select
          {...field}
          {...props}
          className={`w-full border-gray-300 rounded-lg shadow-sm ${
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
