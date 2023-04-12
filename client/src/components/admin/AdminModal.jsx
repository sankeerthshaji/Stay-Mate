import ReactDOM from "react-dom";
import { useEffect } from "react";

function AdminModal({ onClose, children }) {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return ReactDOM.createPortal(
    <div>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-300 opacity-80"
      ></div>
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 w-80 sm:w-96 bg-white">
        {children}
      </div>
    </div>,
    document.querySelector(".modal-container")
  );
}

export default AdminModal;
