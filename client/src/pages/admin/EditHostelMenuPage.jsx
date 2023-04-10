import React from "react";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminTable from "../../components/admin/AdminTable";
import EditHostelMenu from "../../components/admin/EditHostelMenu";

function EditHostelMenuPage() {
  return (
    <div className="flex h-screen">
      <div className="w-16 flex-shrink-0">
        <AdminSideBar />
      </div>
      <div className="flex-1 overflow-x-auto bg-gray-100">
        <EditHostelMenu />
      </div>
    </div>
  );
}

export default EditHostelMenuPage;
