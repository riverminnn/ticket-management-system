import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";
import Header from "../components/Header.tsx";

const AdminLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-h-screen overflow-hidden flex">
        <AdminSidebar />
        <div className="main-content overflow-y-auto flex-grow pt-8 pb-30 w-full bg-gray-50">
          <div className="content ">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;