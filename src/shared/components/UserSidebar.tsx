import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { 
    faHome, faTasks, faUser, faListAlt, faCog, faSignOutAlt,
    faAngleDoubleLeft, faAngleDoubleRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
    id: number;
    name: string;
    icon: IconDefinition;
    link: string;
}

const UserSidebar = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const location = useLocation();
    
    const [menuItems] = useState<MenuItem[]>([
        { id: 1, name: 'Dashboard', icon: faHome, link: '/user/dashboard' },
        { id: 2, name: 'Danh sách yêu cầu hỗ trợ', icon: faListAlt, link: '/user/tickets' },
        { id: 3, name: 'Yêu cầu đang theo dõi', icon: faTasks, link: '/user/tracking' },
        { id: 4, name: 'Yêu cầu được phân công', icon: faUser, link: '/user/assigned' },
        { id: 5, name: 'Thiết lập', icon: faCog, link: '/user/settings' },
    ]);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    }

    useEffect(() => {
        const handleResize = () => {
            if (globalThis.innerWidth <= 765) {
                setIsExpanded(false);
            } else {
                setIsExpanded(true);
            }
        };

        // Set initial state
        handleResize();

        // Add event listener
        globalThis.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => {
            globalThis.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <aside 
            className={`flex flex-col bg-white border-r border-gray-200 h-full transition-all duration-300 ease-in-out ${
                isExpanded ? "w-64" : "w-16"
            }`}
            style={{
                boxShadow: isExpanded ? '2px 0 4px rgba(0, 0, 0, 0.05)' : 'none'
            }}>
            
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-blue-600">
                <div className={`transition-all duration-300 ease-in-out ${
                    isExpanded ? "opacity-100" : "opacity-0"
                }`}>
                    <h2 className="text-white font-bold text-lg">DX-REQUEST</h2>
                </div>
            </div>

            {/* Menu Items */}
            <div className="sidebar-menu flex-1 overflow-y-auto overflow-x-hidden bg-white">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.link || 
                                     (item.link !== '/' && location.pathname.startsWith(item.link));
                    return (
                        <Link 
                            key={item.id} 
                            to={item.link} 
                            className={`flex items-center gap-3 py-3 px-4 transition-all duration-200 ease-in-out group border-b border-gray-100
                            ${isActive 
                                ? 'bg-blue-50 text-blue-600 border-l-4 border-l-blue-600' 
                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}
                        >
                            <div className="min-w-6 h-6 flex items-center justify-center">
                                <FontAwesomeIcon 
                                    icon={item.icon} 
                                    className={`text-lg transition-transform duration-300 ${isExpanded ? '' : 'transform scale-110'}`} 
                                />
                            </div>
                            <div className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                                isExpanded 
                                    ? "max-w-xs opacity-100" 
                                    : "max-w-0 opacity-0"
                            }`}>
                                <span className="text-sm font-medium">{item.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Footer with toggle button */}
            <div className={`sidebar-bottom border-t border-gray-200 bg-white py-4 px-2 flex justify-between items-center`}>
                <div className={`transition-all duration-300 ease-in-out ${
                    isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0 overflow-hidden"
                }`}>
                    <button 
                        className="w-8 h-8 rounded-full ml-2 bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"
                        title="Logout"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </button>
                </div>
                <button 
                    type="button" 
                    onClick={toggleSidebar} 
                    className="w-8 h-8 rounded-full mr-2 bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                    title="Toggle Sidebar"
                >
                    <FontAwesomeIcon 
                        icon={isExpanded ? faAngleDoubleLeft : faAngleDoubleRight} 
                        className="transition-transform duration-300 ease-in-out"
                    />
                </button>
            </div>
        </aside>
    );
};

export default UserSidebar;
