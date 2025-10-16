import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const requests = [
        {
            id: 3151,
            title: '[FTMS-FM] Bổ sung thêm các trường thông tin chi tiết cước - Phục vụ báng kê trên FM',
            categoryId: 101,
            creatorId: 201,
            headDepartmentId: 301,
            priority: 'Cao',
            status: 'Đang thực hiện',
            createdAt: '10-05-2024',
            statusColor: 'bg-blue-500'
        },
        {
            id: 3152,
            title: 'Đề xuất LL-BMO version mới điều chỉnh phần định k',
            categoryId: 102,
            creatorId: 201,
            headDepartmentId: 302,
            priority: 'Trung bình',
            status: 'Từ chối',
            createdAt: '11-05-2024',
            statusColor: 'bg-red-500'
        },
        {
            id: 3153,
            title: 'Check giúp tình trang HNDC00626',
            categoryId: 103,
            creatorId: 202,
            headDepartmentId: 301,
            priority: 'Thấp',
            status: 'Đã xử lý',
            createdAt: '12-05-2024',
            statusColor: 'bg-green-500'
        },
        {
            id: 3154,
            title: 'Phiếu TL kệnh Offnet trên BMO',
            categoryId: 101,
            creatorId: 201,
            headDepartmentId: 303,
            priority: 'Cao',
            status: 'Chưa tiếp nhận',
            createdAt: '13-05-2024',
            statusColor: 'bg-orange-500'
        }
    ];


const UserTicketList = () => {
    const navigate = useNavigate();

    const handleViewDetail = (ticketId: number) => {
        navigate(`/user/tickets/${ticketId}`);
    };

    return (
 <div className="flex min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="flex-1 bg-white">

                {/* Action Bar */}
                <div className="px-6 py-4 flex justify-end gap-3">
                    <button
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                        <span>📤</span>
                        <span>Export</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                        <span className="text-blue-600">▼</span>
                    </button>
                </div>

                {/* Table */}
                <div className="px-6">
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Mã yêu cầu</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Tiêu đề</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Mã danh mục</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Mã người tạo</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Mã trưởng phòng phụ trách</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Mức độ ưu tiên</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Trạng thái</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Ngày tạo</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {requests.map((request, index) => (
                                <tr key={request.id}
                                    className={`border-t border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{request.id}</td>
                                    <td className="px-4 py-4 text-sm max-w-xs">{request.title}</td>
                                    <td className="px-4 py-4 text-sm text-center">{request.categoryId}</td>
                                    <td className="px-4 py-4 text-sm text-center">{request.creatorId}</td>
                                    <td className="px-4 py-4 text-sm text-center">{request.headDepartmentId}</td>
                                    <td className="px-4 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            request.priority === 'Cao' ? 'bg-red-100 text-red-700' :
                                            request.priority === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {request.priority}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`${request.statusColor} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm">{request.createdAt}</td>
                                    <td className="px-4 py-4">
                                        <button 
                                            onClick={() => handleViewDetail(request.id)}
                                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                                            title="Xem chi tiết"
                                        >
                                            <FontAwesomeIcon icon={faEye} className="text-lg" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between py-4">
                        <div className="flex gap-1">
                            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">2
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">3
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">4
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">5
                            </button>
                            <span className="px-2 py-1 text-sm">...</span>
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">▶
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">⏭️
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                                <option>10</option>
                                <option>20</option>
                                <option>50</option>
                            </select>
                            <span className="text-sm text-gray-600">mục trên trang</span>
                        </div>
                        <div className="text-sm text-gray-600">
                            Đang xem 1 đến 10 trong tổng số 166 mục
                        </div>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default UserTicketList;