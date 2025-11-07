import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
    faSpinner,
    faSync,
    faClock,
    faTag,
    faCircleCheck,
    faCircleXmark,
    faHourglassHalf,
    faArrowRight,
    faTable,
    faThLarge,
    faUser, faDownload
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useTicketFilters } from "../../hooks/useTicketFilters";
import TicketFilterBar from "../../shared/components/TicketFilterBar";
import { API_CONFIG } from "../../config/api";
import "./Tickets.css";

interface ITicket {
    id: number;
    title: string;
    category: string;
    project: string;
    headDepartment?: string;
    creator: number;
    priority: string;
    assigneeNames?: string;
    createAt: string;
    status: string;
    statusColor: string;
}

type ViewMode = 'table' | 'card';
type FilterType = 'all' | 'created' | 'assigned' | 'following';

// Helper functions moved outside component for better performance
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
        case 'Đang xử lý': return 'bg-blue-500';
        case 'Đã xử lý': return 'bg-green-500';
        case 'Từ chối': return 'bg-red-500';
        case 'Chưa tiếp nhận': return 'bg-orange-500';
        case 'Đã tiếp nhận': return 'bg-yellow-500';
        default: return 'bg-gray-500';
    }
};

const UserTicketListWithAPI = () => {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [filterType, setFilterType] = useState<FilterType>('all');

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
        searchFields: ['title', 'id', 'category', 'creator', 'headDepartment']
    });

    const fetchTickets = useCallback(async () => {
        try {
            setLoading(true);
            console.log('Fetching tickets from API...');

            const requestBody: any = {
                pageSize: 1000,
                pageNumber: 1
            };

            // Add filters based on filter type
            if (filterType === 'created') {
                requestBody.isCreated = true;
            } else if (filterType === 'assigned') {
                requestBody.isAssigned = true;
            } else if (filterType === 'following') {
                requestBody.isFollowing = true;
            }

            const response = await fetch(`${API_CONFIG.baseUrl}/Ticket/get_list`, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${API_CONFIG.getToken()}`
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);

            if (result.success && result.data && result.data.tickets) {
                const mappedTickets = result.data.tickets.map((ticket: any) => ({
                    id: ticket.id || Math.random() * 10000,
                    title: ticket.title || 'No Title',
                    category: ticket.category || 'N/A',
                    project: ticket.project || 'N/A',
                    headDepartment: ticket.headDepartment,
                    creator: ticket.creator || 0,
                    priority: mapPriority(ticket.priority),
                    assigneeNames: ticket.assigneeNames || 'Chưa có người nhận',
                    createAt: ticket.createAt || new Date().toISOString(),
                    status: mapStatus(ticket.status),
                    statusColor: getStatusColor(ticket.status)
                }));
                console.log('Mapped tickets:', mappedTickets);
                setTickets(mappedTickets);
            } else {
                console.warn('API returned empty data');
                setTickets([]);
            }
        } catch (err: any) {
            console.error('Error fetching tickets:', err);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    }, [filterType]); // Add filterType as dependency

    // Fetch tickets on mount and when filterType changes
    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredCount, itemsPerPage]);

    const handleFilterTypeChange = (type: FilterType) => {
        setFilterType(type);
        // Auto-switch to card view for "my tickets" type filters
        if (type !== 'all') {
            setViewMode('card');
        } else {
            setViewMode('table');
        }
    };

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
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {filterType === 'all' ? 'Danh sách yêu cầu' :
                         filterType === 'created' ? 'Yêu cầu của tôi' :
                         filterType === 'assigned' ? 'Yêu cầu được giao' :
                         'Yêu cầu theo dõi'}
                    </h1>

                    {/* Filter Type Tabs */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => handleFilterTypeChange('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filterType === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            Tất cả yêu cầu
                        </button>
                        <button
                            onClick={() => handleFilterTypeChange('created')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filterType === 'created'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            Yêu cầu tôi tạo
                        </button>
                        <button
                            onClick={() => handleFilterTypeChange('assigned')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filterType === 'assigned'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            Được giao cho tôi
                        </button>
                        <button
                            onClick={() => handleFilterTypeChange('following')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filterType === 'following'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            Đang theo dõi
                        </button>
                    </div>

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
                        {/* View Mode Toggle */}
                        <div className="flex gap-1 border border-gray-300 rounded overflow-hidden">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-2 text-sm transition-colors ${
                                    viewMode === 'table'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                                title="Table View"
                            >
                                <FontAwesomeIcon icon={faTable} />
                            </button>
                            <button
                                onClick={() => setViewMode('card')}
                                className={`px-3 py-2 text-sm transition-colors ${
                                    viewMode === 'card'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                                title="Card View"
                            >
                                <FontAwesomeIcon icon={faThLarge} />
                            </button>
                        </div>

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
                            <FontAwesomeIcon icon={faDownload} />
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
                    ) : viewMode === 'table' ? (
                        <TableView tickets={paginatedTickets} onViewDetail={handleViewDetail} />
                    ) : (
                        <CardView tickets={paginatedTickets} onViewDetail={handleViewDetail} />
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

// Table View Component
const TableView = ({ tickets, onViewDetail }: { tickets: ITicket[]; onViewDetail: (id: number) => void }) => {
    return (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Mã yêu cầu</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Tiêu đề</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Danh mục</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Dự án</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Người xử lý</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Ưu tiên</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Ngày tạo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Hành động</th>
                </tr>
                </thead>
                <tbody>
                {tickets.length === 0 ? (
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
                    tickets.map((ticket, index) => (
                        <tr
                            key={ticket.id}
                            className={`border-t border-gray-200 hover:bg-gray-50 transition-colors ${
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                        >
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">{ticket.id}</td>
                            <td className="px-4 py-4 text-sm max-w-xs truncate">{ticket.title}</td>
                            <td className="px-4 py-4 text-sm">{ticket.category}</td>
                            <td className="px-4 py-4 text-sm">{ticket.project}</td>
                            <td className="px-4 py-4 text-sm">{ticket.assigneeNames}</td>
                            <td className="px-4 py-4 text-sm">
                                <span className={`priority-badge ${
                                    ticket.priority === 'Cao' ? 'priority-high' :
                                    ticket.priority === 'Trung bình' ? 'priority-medium' :
                                    'priority-low'
                                }`}>
                                    {ticket.priority}
                                </span>
                            </td>
                            <td className="px-4 py-4">
                                <span className={`status-badge ${ticket.statusColor.replace('bg-', 'status-')}`}>
                                    {ticket.status}
                                </span>
                            </td>
                            <td className="px-4 py-4 text-sm">
                                {new Date(ticket.createAt).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="px-4 py-4">
                                <button
                                    onClick={() => onViewDetail(ticket.id)}
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
    );
};

// Card View Component
const CardView = ({ tickets, onViewDetail }: { tickets: ITicket[]; onViewDetail: (id: number) => void }) => {
    if (tickets.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
                <span className="text-4xl mb-2">🔍</span>
                <p className="text-lg font-medium text-gray-700">Không tìm thấy yêu cầu nào</p>
                <p className="text-sm mt-1 text-gray-500">Thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn</p>
            </div>
        );
    }

    return (
        <div className="card-grid mt-4">
            {tickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} onViewDetail={onViewDetail} />
            ))}
        </div>
    );
};

// Helper functions
const getPriorityClass = (priority: string) => {
    switch (priority) {
        case 'Cao': return 'priority-high';
        case 'Trung bình': return 'priority-medium';
        case 'Thấp': return 'priority-low';
        default: return 'priority-medium';
    }
};

const getProgressStep = (status: string) => {
    switch (status) {
        case 'Chưa tiếp nhận': return 1;
        case 'Đã tiếp nhận': return 2;
        case 'Đang xử lý': return 3;
        case 'Đã xử lý': return 4;
        default: return 0;
    }
};

const getProgressPercentage = (step: number) => {
    return Math.round((step / 4) * 100);
};

// Ticket Card Component
const TicketCard = ({ ticket, onViewDetail }: { ticket: ITicket; onViewDetail: (id: number) => void }) => {
    const currentStep = getProgressStep(ticket.status);
    const progressPercentage = getProgressPercentage(currentStep);

    return (
        <div className="ticket-card">
            <div className="ticket-card-header">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faTag} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">{ticket.category}</span>
                </div>
                <span className={`priority-badge ${getPriorityClass(ticket.priority)}`}>
                    {ticket.priority}
                </span>
            </div>

            <div className="ticket-card-body">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-600 mb-1">TICKET #{ticket.id}</p>
                        <h3
                            className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-700 cursor-pointer transition-colors"
                            onClick={() => onViewDetail(ticket.id)}
                        >
                            {ticket.title}
                        </h3>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FontAwesomeIcon icon={faClock} className="w-4" />
                        <span>Tạo: {new Date(ticket.createAt).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FontAwesomeIcon icon={faUser} className="w-4" />
                        <span>Người xử lý: {ticket.assigneeNames}</span>
                    </div>
                </div>

                {/* Progress Summary */}
                <div className="progress-summary">
                    <div className="progress-indicator">
                        {progressPercentage}%
                    </div>
                    <div className="progress-text">
                        <div className="progress-label">Tiến độ xử lý</div>
                        <div className="progress-value">{ticket.status}</div>
                    </div>
                </div>
            </div>

            <div className="ticket-card-footer">
                {ticket.status === 'Từ chối' ? (
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-red-600">
                            <FontAwesomeIcon icon={faCircleXmark} />
                            <span className="text-sm font-semibold">Đã bị từ chối</span>
                        </div>
                        <button
                            onClick={() => onViewDetail(ticket.id)}
                            className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1.5 transition-colors"
                        >
                            Xem chi tiết
                            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                {ticket.status === 'Đang xử lý' && <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600" />}
                                {ticket.status === 'Chưa tiếp nhận' && <FontAwesomeIcon icon={faHourglassHalf} className="text-gray-500" />}
                                {ticket.status === 'Đã tiếp nhận' && <FontAwesomeIcon icon={faHourglassHalf} className="text-yellow-600" />}
                                {ticket.status === 'Đã xử lý' && <FontAwesomeIcon icon={faCircleCheck} className="text-green-600" />}
                                <span className="text-sm font-semibold text-gray-700">Trạng thái</span>
                            </div>
                            <button
                                onClick={() => onViewDetail(ticket.id)}
                                className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1.5 transition-colors"
                            >
                                Xem chi tiết
                                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                            </button>
                        </div>

                        <div className="progress-stepper">
                            <div className={`step ${currentStep > 1 ? 'is-complete' : ''} ${currentStep === 1 ? 'is-active' : ''}`}>
                                <div className="step-marker">1</div>
                                <div className="step-title">Chờ tiếp nhận</div>
                            </div>
                            <div className={`step ${currentStep > 2 ? 'is-complete' : ''} ${currentStep === 2 ? 'is-active' : ''}`}>
                                <div className="step-marker">2</div>
                                <div className="step-title">Đã tiếp nhận</div>
                            </div>
                            <div className={`step ${currentStep > 3 ? 'is-complete' : ''} ${currentStep === 3 ? 'is-active' : ''}`}>
                                <div className="step-marker">3</div>
                                <div className="step-title">Đang xử lý</div>
                            </div>
                            <div className={`step ${currentStep === 4 ? 'is-complete' : ''} ${currentStep === 4 ? 'is-active' : ''}`}>
                                <div className="step-marker">4</div>
                                <div className="step-title">Hoàn thành</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTicketListWithAPI;