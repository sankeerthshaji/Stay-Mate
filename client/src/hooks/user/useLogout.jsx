import { useDispatch } from "react-redux";

export default function useLogout() {
  const dispatch = useDispatch();
  const logout = () => {
    //check if user is logged in as guest
    if (localStorage.getItem("guest")) {
      localStorage.removeItem("guest");
      dispatch({
        type: "GUEST_LOGOUT",
      });
    }
    //check if user is logged in as resident
    if (localStorage.getItem("resident")) {
      localStorage.removeItem("resident");
      dispatch({
        type: "RESIDENT_LOGOUT",
      });
    }
  };
  return { logout };
}
