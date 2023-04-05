import { useDispatch } from "react-redux";

export default function useAdminLogout() {
    const dispatch = useDispatch();
    const adminLogout = () => {
        //remove user data from local storage
        localStorage.removeItem("admin");
        //remove user data from redux store
        dispatch({
            type: "ADMIN_LOGOUT",
        });
    };

  return { adminLogout }; 
}
