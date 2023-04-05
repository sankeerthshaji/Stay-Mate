import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import useLogin from "../../hooks/user/useLogin";

function Login() {
  const inputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, loading } = useLogin();

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
            <div className="text-2xl font-bold">Welcome back</div>
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
              <div className="ml-auto mt-0.5 underline text-blue-500 cursor-pointer">
                {" "}
                <Link to="/forgotPassword">Forgot password?</Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-md transform hover:scale-105 transition duration-300">
                {loading ? <ClipLoader size={20} color={"#fff"} /> : "Login"}
              </button>
              <div className="text-gray-700 text-sm font-light flex justify-center">
                Don't have an account?{" "}
                <span className="ml-1 font-normal text-blue-600 underline">
                  <Link to="/admission">Apply for Admission</Link>
                </span>
              </div>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
