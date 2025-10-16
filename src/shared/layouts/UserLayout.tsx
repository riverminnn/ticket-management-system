import Header from "../components/Header";
import UserSidebar from "../components/UserSidebar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <UserSidebar />
        <main className="flex-1 bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;