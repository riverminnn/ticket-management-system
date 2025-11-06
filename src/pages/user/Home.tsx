import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTicket, 
    faClock,
    faCheckCircle,
    faTimesCircle,
    faPlus
} from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';

const Home = () => {
    // const navigate = useNavigate();

    const stats = [
        { icon: faTicket, label: 'Tổng yêu cầu', value: '24', color: 'bg-blue-500' },
        { icon: faClock, label: 'Đang xử lý', value: '8', color: 'bg-yellow-500' },
        { icon: faCheckCircle, label: 'Đã hoàn thành', value: '14', color: 'bg-green-500' },
        { icon: faTimesCircle, label: 'Từ chối', value: '2', color: 'bg-red-500' },
    ];

    const handleCreateTicket = () => {
        // Navigate to create ticket page or open modal
        console.log('Create new ticket');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Xin chào, Vu Thach Nhu Han! 👋
                    </h1>
                    <p className="text-gray-600">
                        Chào mừng bạn đến với hệ thống quản lý yêu cầu hỗ trợ. Hãy tạo yêu cầu mới hoặc theo dõi các yêu cầu hiện tại của bạn.
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                    <FontAwesomeIcon icon={stat.icon} className="text-white text-xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create Ticket Button - Centered */}
                <div className="flex justify-center items-center py-12">
                    <button
                        onClick={handleCreateTicket}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-3 text-lg"
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-xl" />
                        Tạo yêu cầu hỗ trợ mới
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
