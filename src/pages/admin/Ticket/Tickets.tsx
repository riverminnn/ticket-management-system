import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
    faSpinner,
    faSync,
    faUserPlus,
    faCircleXmark,
    faCheck,
    faTable,
    faThLarge,
    faChartBar,
    faDownload
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useTicketFilters } from "../../../hooks/useTicketFilters";
import TicketFilterBar from "../../../shared/components/TicketFilterBar";
import { API_CONFIG } from "../../../config/api";
import AssignTicket from "./AssignTicket";
import RejectTicket from "./RejectTicket";
import "./Tickets.css";

interface ITicket {
    id: number;
    title: string;
    category: string;
    project: string;
    headDepartment?: string;
    creator: number;
    creatorName?: string;
    priority: string;
    assigneeNames?: string;
    createAt: string;
    status: string;
    statusColor: string;
}

type ViewMode = 'table' | 'card';

const AdminTicketList = () => {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [selectedTickets, setSelectedTickets] = useState<number[]>([]);

    // Modal states
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [currentTicketId, setCurrentTicketId] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        rejected: 0
    });

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
        searchFields: ['title', 'id', 'category', 'creator', 'creatorName', 'headDepartment']
    });

    const fetchTickets = async () => {
        try {
            setLoading(true);
            console.log('Fetching tickets from API...');

            const requestBody = {
                pageSize: 1000,
                pageNumber: 1
            };

            const response = await fetch(`${API_CONFIG.baseUrl}/Ticket/get_list`, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${API_CONFIG.getToken()}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.data && result.data.tickets) {
                const mappedTickets = result.data.tickets.map((ticket: any) => ({
                    id: ticket.id || Math.random() * 10000,
                    title: ticket.title || 'No Title',
                    category: ticket.category || 'N/A',
                    project: ticket.project || 'N/A',
                    headDepartment: ticket.headDepartment,
                    creator: ticket.creator || 0,
                    creatorName: ticket.creatorName,
                    priority: mapPriority(ticket.priority),
                    assigneeNames: ticket.assigneeNames || 'Chưa có người nhận',
                    createAt: ticket.createAt || new Date().toISOString(),
                    status: mapStatus(ticket.status),
                    statusColor: getStatusColor(ticket.status)
                }));
                setTickets(mappedTickets);
                calculateStats(mappedTickets);
            } else {
                setTickets([]);
            }
        } catch (err: any) {
            console.error('Error fetching tickets:', err);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (tickets: ITicket[]) => {
        setStats({
            total: tickets.length,
            pending: tickets.filter(t => t.status === 'Chưa tiếp nhận').length,
            inProgress: tickets.filter(t => t.status === 'Đang xử lý' || t.status === 'Đã tiếp nhận').length,
            completed: tickets.filter(t => t.status === 'Đã xử lý').length,
            rejected: tickets.filter(t => t.status === 'Từ chối').length
        });
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
            case 'Đang xử lý': return 'bg-blue-500';
            case 'Đã xử lý': return 'bg-green-500';
            case 'Từ chối': return 'bg-red-500';
            case 'Chưa tiếp nhận': return 'bg-orange-500';
            case 'Đã tiếp nhận': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredCount, itemsPerPage]);

    const handleViewDetail = (ticketId: number) => {
        navigate(`/admin/tickets/${ticketId}`);
    };

    const handleRefresh = () => {
        fetchTickets();
        setSelectedTickets([]);
    };

    const handleSelectAll = () => {
        if (selectedTickets.length === paginatedTickets.length) {
            setSelectedTickets([]);
        } else {
            setSelectedTickets(paginatedTickets.map(t => t.id));
        }
    };

    const handleSelectTicket = (ticketId: number) => {
        setSelectedTickets(prev =>
            prev.includes(ticketId)
                ? prev.filter(id => id !== ticketId)
                : [...prev, ticketId]
        );
    };

    const handleBulkAssign = () => {
        if (selectedTickets.length > 0) {
            setCurrentTicketId(selectedTickets[0]); // For now, open modal for first selected
            setAssignModalOpen(true);
        }
    };

    const handleBulkReject = () => {
        if (selectedTickets.length > 0) {
            setCurrentTicketId(selectedTickets[0]); // For now, open modal for first selected
            setRejectModalOpen(true);
        }
    };

    const handleAssignTicket = (ticketId: number) => {
        setCurrentTicketId(ticketId);
        setAssignModalOpen(true);
    };

    const handleRejectTicket = (ticketId: number) => {
        setCurrentTicketId(ticketId);
        setRejectModalOpen(true);
    };

    const handleModalSuccess = () => {
        fetchTickets();
        setSelectedTickets([]);
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
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý yêu cầu</h1>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faChartBar} />
                            <span>Thống kê</span>
                        </button>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-5 gap-4 mb-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-1">Tổng số</div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        </div>
                        <div className="bg-white border border-orange-200 rounded-lg p-4">
                            <div className="text-sm text-orange-600 mb-1">Chưa tiếp nhận</div>
                            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                        </div>
                        <div className="bg-white border border-blue-200 rounded-lg p-4">
                            <div className="text-sm text-blue-600 mb-1">Đang xử lý</div>
                            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                        </div>
                        <div className="bg-white border border-green-200 rounded-lg p-4">
                            <div className="text-sm text-green-600 mb-1">Hoàn thành</div>
                            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                        </div>
                        <div className="bg-white border border-red-200 rounded-lg p-4">
                            <div className="text-sm text-red-600 mb-1">Từ chối</div>
                            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                        </div>
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
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                            Hiển thị <span className="font-semibold">{paginatedTickets.length}</span> / {filteredCount} yêu cầu
                        </div>
                        {selectedTickets.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-600 font-medium">
                                    {selectedTickets.length} đã chọn
                                </span>
                                <button
                                    onClick={handleBulkAssign}
                                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1.5"
                                >
                                    <FontAwesomeIcon icon={faUserPlus} />
                                    Phân công
                                </button>
                                <button
                                    onClick={handleBulkReject}
                                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1.5"
                                >
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                    Từ chối
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <div className="flex gap-1 border border-gray-300 rounded overflow-hidden">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-2 text-sm transition-colors ${
                                    viewMode === 'table'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
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

                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                            <FontAwesomeIcon icon={faDownload} />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-4xl mb-4" />
                            <p className="text-gray-600">Đang tải dữ liệu...</p>
                        </div>
                    ) : viewMode === 'table' ? (
                        <AdminTableView
                            tickets={paginatedTickets}
                            selectedTickets={selectedTickets}
                            onSelectAll={handleSelectAll}
                            onSelectTicket={handleSelectTicket}
                            onViewDetail={handleViewDetail}
                            onAssign={handleAssignTicket}
                            onReject={handleRejectTicket}
                        />
                    ) : (
                        <div className="card-grid mt-4">
                            {paginatedTickets.map(ticket => (
                                <div key={ticket.id} className="ticket-card">
                                    <div className="ticket-card-header">
                                        <span className="text-sm font-semibold text-blue-600">TICKET #{ticket.id}</span>
                                        <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                    <div className="ticket-card-body">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{ticket.title}</h3>
                                        <div className="text-sm text-gray-600 mb-2">Người tạo: {ticket.creatorName || ticket.creator}</div>
                                        <span className={`status-badge ${ticket.statusColor.replace('bg-', 'status-')}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <div className="ticket-card-footer flex gap-2">
                                        <button
                                            onClick={() => handleViewDetail(ticket.id)}
                                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                        >
                                            <FontAwesomeIcon icon={faEye} /> Chi tiết
                                        </button>
                                        <button
                                            onClick={() => handleAssignTicket(ticket.id)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                                        >
                                            <FontAwesomeIcon icon={faUserPlus} /> Phân công
                                        </button>
                                    </div>
                                </div>
                            ))}
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

            {/* Modals */}
            {currentTicketId && (
                <>
                    <AssignTicket
                        isOpen={assignModalOpen}
                        onClose={() => setAssignModalOpen(false)}
                        ticketId={currentTicketId}
                        onSuccess={handleModalSuccess}
                    />
                    <RejectTicket
                        isOpen={rejectModalOpen}
                        onClose={() => setRejectModalOpen(false)}
                        ticketId={currentTicketId}
                        onSuccess={handleModalSuccess}
                    />
                </>
            )}
        </div>
    );
};

// Admin Table View with Selection
const AdminTableView = ({ tickets, selectedTickets, onSelectAll, onSelectTicket, onViewDetail, onAssign, onReject }: any) => {
    return (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left">
                        <input
                            type="checkbox"
                            checked={tickets.length > 0 && selectedTickets.length === tickets.length}
                            onChange={onSelectAll}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Tiêu đề</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Người tạo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Danh mục</th>
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
                        <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-4xl mb-2">🔍</span>
                                <p className="text-lg font-medium">Không tìm thấy yêu cầu nào</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    tickets.map((ticket: ITicket, index: number) => (
                        <tr
                            key={ticket.id}
                            className={`border-t border-gray-200 hover:bg-gray-50 transition-colors ${
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                        >
                            <td className="px-4 py-4">
                                <input
                                    type="checkbox"
                                    checked={selectedTickets.includes(ticket.id)}
                                    onChange={() => onSelectTicket(ticket.id)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">{ticket.id}</td>
                            <td className="px-4 py-4 text-sm max-w-xs truncate">{ticket.title}</td>
                            <td className="px-4 py-4 text-sm">{ticket.creatorName || ticket.creator}</td>
                            <td className="px-4 py-4 text-sm">{ticket.category}</td>
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
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onViewDetail(ticket.id)}
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                                        title="Xem chi tiết"
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                    <button
                                        onClick={() => onAssign(ticket.id)}
                                        className="text-green-600 hover:text-green-800 hover:bg-green-50 p-2 rounded transition-colors"
                                        title="Phân công"
                                    >
                                        <FontAwesomeIcon icon={faUserPlus} />
                                    </button>
                                    <button
                                        onClick={() => onReject(ticket.id)}
                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors"
                                        title="Từ chối"
                                    >
                                        <FontAwesomeIcon icon={faCircleXmark} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTicketList;