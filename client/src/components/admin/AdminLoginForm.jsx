import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAdminLogin from "../../hooks/admin/useAdminLogin";
import { ClipLoader } from "react-spinners";


function AdminLoginForm() {
  const inputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, loading } = useAdminLogin();
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex justify-center h-screen items-center bg-gray-50">
      <div className="w-80 sm:w-96 shadow-2xl px-5 py-6 bg-white">
        <div className="grid gap-8">
          <div className="grid gap-2">
            <div className="text-2xl font-bold">Welcome Admin</div>
            <div className="text-sm font-light text-gray-500">
              Welcome back! Please enter your details
            </div>
          </div>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            
            <div>
              <input
                className="w-full border-2 border-gray-300 p-2 rounded-md"
                ref={inputRef}
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <input
                className="w-full border-2 border-gray-300 p-2 rounded-md"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex">
              <div>
                <input
                  type="checkbox"
                  className="mr-2 cursor-pointer"
                  id="checkbox"
                  defaultChecked
                />
                <label
                  className="text-sm font-light text-gray-500 cursor-pointer"
                  htmlFor="checkbox"
                >
                  Remember me
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button className="bg-blue-500 text-white p-2 rounded-md">
                {loading ? <ClipLoader size={20} color={"#fff"} /> : "Login"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginForm;
