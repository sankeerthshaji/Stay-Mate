import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex gap-4 text-2xl">
        <h1 className="font-gray-900 font-semibold">404</h1>
        <p className="px-4 font-semibold text-red-500 border-l-2 border-gray-900">
          Not Found
        </p>
      </div>
      <p className="mt-4 text-gray-900">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <p className="text-gray-900">
        Go to
        <Link
          to="/"
          className="ml-1.5 text-blue-900 cursor-pointer hover:text-indigo-600 hover:underline"
        >
          Home
        </Link>
      </p>
    </div>
  );
}
