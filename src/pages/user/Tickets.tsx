import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSpinner, faSync } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useTicketFilters } from "../../hooks/useTicketFilters";
import TicketFilterBar from "../../shared/components/TicketFilterBar";
import { API_CONFIG } from "../../config/api";

interface ITicket {
    id: number;
    title: string;
    categoryId: number;
    creatorId: number;
    headDepartmentId: number;
    priority: string;
    status: string;
    createdAt: string;
    statusColor: string;
}

const UserTicketListWithAPI = () => {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    const {
        sortedTickets,
        searchTerm,
        setSearchTerm,
        selectedPriority,
        setSelectedPriority,
        selectedStatus,
        setSelectedStatus,
        selectedCategory,
        setSelectedCategory,
        sortField,
        sortDirection,
        handleSort,
        isFilterMenuOpen,
        toggleFilterMenu,
        clearFilters,
        uniquePriorities,
        uniqueStatuses,
        uniqueCategories,
        filteredCount,
    } = useTicketFilters<ITicket>({
        tickets: tickets,
        searchFields: ['title', 'id', 'categoryId', 'creatorId', 'headDepartmentId']
    });

    const fetchTickets = async () => {
        try {
            setLoading(true);
            console.log('Fetching tickets from API...');

            const response = await fetch(`${API_CONFIG.baseUrl}/Ticket/get_list`, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': API_CONFIG.token
                },
                body: JSON.stringify({
                    pageSize: 1000,
                    pageNumber: 1
                })
            });

            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);

            if (result.success && result.data && result.data.tickets) {
                const mappedTickets = result.data.tickets.map((ticket: any) => ({
                    id: ticket.id || ticket.ticketId || Math.random() * 10000,
                    title: ticket.title || ticket.subject || ticket.description || 'No Title',
                    categoryId: ticket.categoryId || ticket.category || 0,
                    creatorId: ticket.creatorId || ticket.userId || ticket.creator || 0,
                    headDepartmentId: ticket.headDepartmentId || ticket.departmentId || ticket.department || 0,
                    priority: mapPriority(ticket.priority),
                    status: mapStatus(ticket.status),
                    createdAt: ticket.createdAt || ticket.createDate || ticket.createdDate || new Date().toISOString(),
                    statusColor: getStatusColor(ticket.status)
                }));
                console.log('Mapped tickets:', mappedTickets);
                setTickets(mappedTickets);
            } else {
                console.warn('API returned empty data, using mock data');
                setTickets(getMockData());
            }
        } catch (err: any) {
            console.error('Error fetching tickets:', err);
            setTickets(getMockData());
        } finally {
            setLoading(false);
        }
    };

    const mapPriority = (priority: any): string => {
        if (typeof priority === 'string') {
            const lower = priority.toLowerCase();
            if (lower.includes('high') || lower.includes('cao') || lower === '3') return 'Cao';
            if (lower.includes('medium') || lower.includes('trung') || lower === '2') return 'Trung bình';
            if (lower.includes('low') || lower.includes('thấp') || lower === '1') return 'Thấp';
        }
        if (typeof priority === 'number') {
            if (priority >= 3) return 'Cao';
            if (priority === 2) return 'Trung bình';
            return 'Thấp';
        }
        return 'Trung bình';
    };
    const mapStatus = (status: any): string => {
        if (typeof status === 'string') {
            const lower = status.toLowerCase();

            if (lower === 'inprogress') return 'Đang xử lý';
            if (lower === 'pending') return 'Chưa tiếp nhận';
            if (lower === 'received') return 'Đã tiếp nhận';
            if (lower === 'rejected') return 'Từ chối';
            if (lower === 'closed') return 'Đã xử lý';
        }

        return 'Chưa tiếp nhận';
    };
    const getStatusColor = (status: any): string => {
        const statusStr = mapStatus(status);
        switch (statusStr) {
            case 'Đang thực hiện': return 'bg-blue-500';
            case 'Đã xử lý': return 'bg-green-500';
            case 'Từ chối': return 'bg-red-500';
            case 'Chưa tiếp nhận': return 'bg-orange-500';
            case 'Đã tiếp nhận': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };
    const getMockData = (): ITicket[] => [];

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredCount, itemsPerPage]);


    const handleViewDetail = (ticketId: number) => {
        navigate(`/user/tickets/${ticketId}`);
    };

    const handleRefresh = () => {
        fetchTickets();
    };

    const totalPages = Math.ceil(filteredCount / itemsPerPage);
    const paginatedTickets = sortedTickets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };
    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };
    const startItem = filteredCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, filteredCount);


    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="flex-1 bg-white">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Danh sách yêu cầu</h1>
                    <div className="space-y-4">
                        <TicketFilterBar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedPriority={selectedPriority}
                            setSelectedPriority={setSelectedPriority}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                            clearFilters={clearFilters}
                            uniquePriorities={uniquePriorities}
                            uniqueStatuses={uniqueStatuses}
                            uniqueCategories={uniqueCategories}
                            isFilterMenuOpen={isFilterMenuOpen}
                            toggleFilterMenu={toggleFilterMenu}
                        />
                    </div>
                </div>


                <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
                    <div className="text-sm text-gray-600">
                        Hiển thị <span className="font-semibold">{paginatedTickets.length}</span> / {filteredCount} yêu cầu
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faSync} className={loading ? 'animate-spin' : ''} />
                            <span className="hidden md:inline">Refresh</span>
                        </button>

                        <button
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                            <span>📤</span>
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-4xl mb-4" />
                            <p className="text-gray-600">Đang tải dữ liệu từ API...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Mã yêu cầu</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Tiêu đề</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Mã danh mục</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Mã người tạo</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Mã trưởng phòng</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Mức độ ưu tiên</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Trạng thái</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Ngày tạo</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Hành động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedTickets.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-4xl mb-2">🔍</span>
                                                <p className="text-lg font-medium">Không tìm thấy yêu cầu nào</p>
                                                <p className="text-sm mt-1">Thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedTickets.map((request, index) => (
                                        <tr
                                            key={request.id}
                                            className={`border-t border-gray-200 hover:bg-gray-50 ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            }`}
                                        >
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
                                            <td className="px-4 py-4 text-sm">
                                                {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                                            </td>
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
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && totalPages > 0 && (
                        <div className="flex items-center justify-between py-4">

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-sm text-gray-600">mục trên trang</span>
                            </div>

                            <div className="text-sm text-gray-600">
                                Đang xem {startItem} đến {endItem} trong tổng số {filteredCount} mục
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserTicketListWithAPI;