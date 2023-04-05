import React, { useState } from "react";
import axios from "../../axios/axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import store from "../../redux/store";

function useAdminLogin() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const adminLogin = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("/admin/login", { email, password });
      const json = response.data;
      //save user data in local storage
      localStorage.setItem("admin", JSON.stringify(json));
      //save user data in redux store
      dispatch({
        type: "ADMIN_LOGIN",
        payload: json,
      });
      console.log(store.getState());
      toast.success("Login successfull");
    } catch (error) {
      setError(error.response.data.error);
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return { adminLogin, error, loading };

}

export default useAdminLogin;
