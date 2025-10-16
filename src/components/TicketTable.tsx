export default function TicketTable() {
    const requests = [
        {
            id: 3151,
            title: '[FTMS-FM] Bổ sung thêm các trường thông tin chi tiết cước - Phục vụ báng kê trên FM',
            project: 'FM',
            creator: 'TruongLA',
            time: '9:00 10-05-2024',
            assignee: 'DuyHX',
            qa: 'HangBT13',
            status: 'Đang thực hiện',
            statusColor: 'bg-blue-500'
        },
        {
            id: 3152,
            title: 'Đề xuất LL-BMO version mới điều chỉnh phần định k',
            project: 'FTI-FM v1.2',
            creator: 'TruongLA',
            time: '9:00 10-05-2024',
            assignee: 'TuanNH47',
            qa: 'ThinhNH',
            status: 'Từ chối',
            statusColor: 'bg-red-500'
        },
        {
            id: 3153,
            title: 'Check giúp tình trang HNDC00626',
            project: 'Leasedline/ Quản lý đối tác',
            creator: 'Quannt36',
            time: '9:00 10-05-2024',
            assignee: 'DuyHX',
            qa: 'HangBT13',
            status: 'Đã xử lý',
            statusColor: 'bg-green-500'
        },
        {
            id: 3154,
            title: 'Phiếu TL kệnh Offnet trên BMO',
            project: 'FTI-FPMS',
            creator: 'TruongLA',
            time: '9:00 10-05-2024',
            assignee: 'TuanNH47',
            qa: 'HangBT13',
            status: 'Chưa tiếp nhận',
            statusColor: 'bg-orange-500'
        }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-56 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
                <div className="p-4">
                    <div className="bg-blue-800 rounded px-4 py-2 mb-6">
                        <h2 className="text-sm font-semibold">DX-REQUEST</h2>
                    </div>
                    <nav className="space-y-1">
                        <a href="#" className="flex items-center px-3 py-2 text-sm hover:bg-blue-600 rounded group">
                            <span className="mr-2">📊</span>
                            <span className="flex-1">Dashboard</span>
                            <span className="text-blue-300">›</span>
                        </a>
                        <a href="#" className="flex items-center px-3 py-2 text-sm bg-cyan-500 rounded">
                            <span className="mr-2">📋</span>
                            <span className="flex-1">Danh sách yêu cầu</span>
                            <span>›</span>
                        </a>
                        <a href="#" className="px-8 py-2 text-sm block hover:bg-blue-600 rounded">
                            Yêu cầu đang theo dõi
                        </a>
                        <a href="#" className="flex items-center px-3 py-2 text-sm hover:bg-blue-600 rounded group">
                            <span className="mr-2">📁</span>
                            <span className="flex-1">Yêu cầu được phân công</span>
                            <span className="text-blue-300">›</span>
                        </a>
                        <a href="#" className="flex items-center px-3 py-2 text-sm hover:bg-blue-600 rounded group">
                            <span className="mr-2">⚙️</span>
                            <span className="flex-1">Thiết lập</span>
                            <span className="text-blue-300">›</span>
                        </a>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white">
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <a href="#" className="text-blue-600 hover:underline">Home</a>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-600">Danh sách yêu cầu hỗ trợ</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs">
                                5
                            </div>
                            <div
                                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                VT
                            </div>
                            <span className="text-sm">Vu Thach Nhu Han</span>
                        </div>
                    </div>
                </div>

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
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Mã</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Tiêu đề</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Dự án/Ứng dụng
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Người tạo</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Thời gian tạo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Nhân sự xử lý
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Nhân sự QA tiếp
                                    nhận
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Trạng thái</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {requests.map((request, index) => (
                                <tr key={request.id}
                                    className={`border-t border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <td className="px-4 py-4 text-sm">{request.id}</td>
                                    <td className="px-4 py-4 text-sm max-w-xs">{request.title}</td>
                                    <td className="px-4 py-4 text-sm">{request.project}</td>
                                    <td className="px-4 py-4 text-sm">{request.creator}</td>
                                    <td className="px-4 py-4 text-sm">{request.time}</td>
                                    <td className="px-4 py-4 text-sm">{request.assignee}</td>
                                    <td className="px-4 py-4 text-sm">{request.qa}</td>
                                    <td className="px-4 py-4">
                      <span className={`${request.statusColor} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                        {request.status}
                      </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex gap-2">
                                            <button className="text-gray-600 hover:text-gray-800">👁️</button>
                                            <button className="text-gray-600 hover:text-gray-800">🔗</button>
                                        </div>
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
}