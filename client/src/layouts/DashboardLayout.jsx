import React from "react";
import { Outlet } from "react-router-dom";
import useRole from "../hooks/useRole";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";

const DashboardLayout = () => {
  const [role] = useRole();
  return (
    <div className="relative min-h-screen md:flex">
      <div>
        <Sidebar />
      </div>
      <div className="flex md:ml-72">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
