import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUser } from '@fortawesome/free-solid-svg-icons';

const ViewSwitcher = () => {
    // This component will only render in development mode
    if (!import.meta.env.DEV) {
        return null;
    }

    const navigate = useNavigate();
    const location = useLocation();

    const isAdminView = location.pathname.startsWith('/admin');

    const handleSwitch = () => {
        if (isAdminView) {
            // Switch to User view
            navigate('/user');
        } else {
            // Switch to Admin view
            navigate('/admin');
        }
    };

    return (
        <button
            onClick={handleSwitch}
            className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-blue-700"
            title={isAdminView ? 'Switch to User View' : 'Switch to Admin View'}
        >
            <FontAwesomeIcon icon={isAdminView ? faUser : faUserShield} className="text-2xl" />
        </button>
    );
};

export default ViewSwitcher;