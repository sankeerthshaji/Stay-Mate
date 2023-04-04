import { legacy_createStore as createStore } from "redux";

const initialState = {
  guest: null,
  resident: null,
  admin: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GUEST_LOGIN":
      return {
        ...state,
        guest: action.payload,
      };
    case "GUEST_LOGOUT":
      return {
        ...state,
        guest: null,
      };
      case "RESIDENT_LOGIN":
      return {
        ...state,
        resident: action.payload,
      };
    case "RESIDENT_LOGOUT":
      return {
        ...state,
        resident: null,
      };
    case "ADMIN_LOGIN":
      return {
        ...state,
        admin: action.payload,
      };
    case "ADMIN_LOGOUT":
      return {
        ...state,
        admin: null,
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
