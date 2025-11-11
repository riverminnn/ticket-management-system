import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200 relative flex justify-center items-center flex-col">
      <div className="w-full h-16 flex items-center justify-between px-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span className="text-blue-600">Danh sách yêu cầu hỗ trợ</span>
        </div>

        {/* User info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FontAwesomeIcon icon={faUser} className="text-gray-500" />
            <span>username</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;