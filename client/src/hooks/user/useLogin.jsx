import React, { useState } from "react";
import axios from "../../axios/axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import store from "../../redux/store";
import { useNavigate } from "react-router-dom";

function useLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("/login", { email, password });
      const json = response.data;
      

      if (json.roomNo) {
        //save user data in local storage as guest
        localStorage.setItem("resident", JSON.stringify(json));
        //save user data in redux store
        dispatch({
          type: "RESIDENT_LOGIN",
          payload: json,
        });
        
        // toast.success("Login successfull");
      } else {
        //save user data in local storage as guest
        localStorage.setItem("guest", JSON.stringify(json));
        //save user data in redux store
        dispatch({
          type: "GUEST_LOGIN",
          payload: json,
        });
        
        // toast.success("Login successfull");
      }
    } catch (error) {
      setError(error.response.data.error);
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return { login, error, loading };
}

export default useLogin;
