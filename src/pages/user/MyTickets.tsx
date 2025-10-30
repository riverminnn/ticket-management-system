import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTag, faCircleCheck, faCircleXmark, faHourglassHalf, faSpinner, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { useTicketFilters } from '../../hooks/useTicketFilters';
import TicketFilterBar from '../../shared/components/TicketFilterBar';

import './MyTickets.css';

interface ITicket {
    id: number;
    title: string;
    category: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'Received' | 'InProgress' | 'Closed' | 'Rejected';
    createdAt: string;
    assigneeName?: string;
}

// --- MOCK DATA ---
const getMockData = (): ITicket[] => [
    {
        id: 1024,
        title: '[BUG] Cannot log in to the system with Google',
        category: 'Software Access',
        priority: 'High',
        status: 'InProgress',
        createdAt: '2025-10-30T10:30:00Z',
        assigneeName: 'Nguyễn Minh Sơn'
    },
    {
        id: 1022,
        title: '[REQUEST] Need a new mouse for my desktop',
        category: 'Hardware Support',
        priority: 'Medium',
        status: 'Pending',
        createdAt: '2025-10-30T09:15:00Z'
    },
    {
        id: 1021,
        title: '[BUG] Website footer link is broken on mobile',
        category: 'Website Errors',
        priority: 'Low',
        status: 'Closed',
        createdAt: '2025-10-28T14:00:00Z',
        assigneeName: 'Nguyễn Minh Sơn'
    },
    {
        id: 1019,
        title: '[REQUEST] Access to the new QA environment',
        category: 'Software Access',
        priority: 'Medium',
        status: 'Received',
        createdAt: '2025-10-27T11:00:00Z',
        assigneeName: 'Hoàng Việt Trung'
    },
    {
        id: 1015,
        title: '[QUESTION] How to set up a vacation auto-reply?',
        category: 'General IT',
        priority: 'Low',
        status: 'Rejected',
        createdAt: '2025-10-26T16:30:00Z',
        assigneeName: 'Hoàng Việt Trung'
    }
];

export default function MyTickets() {
    const [tickets, setTickets] = useState<ITicket[]>([]);

    useEffect(() => {
        setTickets(getMockData());
    }, []);

    const {
        sortedTickets,
        ...filterProps
    } = useTicketFilters<ITicket>({
        tickets: tickets,
        searchFields: ['title', 'id', 'category', 'status', 'priority']
    });

    return (
        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Yêu cầu của tôi</h1>

            <div className="mb-4">
                <TicketFilterBar {...filterProps} />
            </div>

            <div className="mb-4 text-sm text-gray-600">
                Hiển thị <span className="font-semibold">{sortedTickets.length}</span> trong <span className="font-semibold">{tickets.length}</span> yêu cầu
            </div>

            <div className="space-y-4">
                {sortedTickets.length > 0 ? (
                    sortedTickets.map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                        <p className="text-gray-500">Không tìm thấy yêu cầu nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
}


const getPriorityClass = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
        case 'High': return 'bg-red-100 text-red-700';
        case 'Medium': return 'bg-yellow-100 text-yellow-700';
        case 'Low': return 'bg-green-100 text-green-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const getProgressStep = (status: 'Pending' | 'Received' | 'InProgress' | 'Closed' | 'Rejected') => {
    switch (status) {
        case 'Pending': return 1;
        case 'Received': return 2;
        case 'InProgress': return 3;
        case 'Closed': return 4;
        default: return 0;
    }
};

const TicketCard = ({ ticket }: { ticket: ITicket }) => {
    const navigate = useNavigate();
    const currentStep = getProgressStep(ticket.status);

    const handleViewDetails = () => {
        navigate(`/user/tickets/${ticket.id}`);
    };

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md">
            <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faTag} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">{ticket.category}</span>
                </div>
                <div className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getPriorityClass(ticket.priority)}`}>
                    {ticket.priority}
                </div>
            </div>

            <div className="p-5">
                <p className="text-sm font-semibold text-blue-600 mb-1">TICKET #{ticket.id}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-blue-700 cursor-pointer" onClick={handleViewDetails}>
                    {ticket.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FontAwesomeIcon icon={faClock} />
                    <span>Tạo lúc: {new Date(ticket.createdAt).toLocaleString('vi-VN')}</span>
                </div>
            </div>

            <div className="bg-gray-50 px-5 py-4 border-t border-gray-100">
                {ticket.status === 'Rejected' ? (
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-red-600">
                            <FontAwesomeIcon icon={faCircleXmark} />
                            <span className="text-sm font-semibold">Đã bị từ chối</span>
                        </div>
                        <button
                            onClick={handleViewDetails}
                            className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1.5"
                        >
                            Xem chi tiết
                            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                {ticket.status === 'InProgress' && <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600" />}
                                {ticket.status === 'Pending' && <FontAwesomeIcon icon={faHourglassHalf} className="text-gray-500" />}
                                {ticket.status === 'Received' && <FontAwesomeIcon icon={faHourglassHalf} className="text-yellow-600" />}
                                {ticket.status === 'Closed' && <FontAwesomeIcon icon={faCircleCheck} className="text-green-600" />}
                                <span className="text-sm font-semibold text-gray-700">Trạng thái: {ticket.status}</span>
                            </div>
                            <button
                                onClick={handleViewDetails}
                                className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1.5"
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
                            <div className={`step ${currentStep > 4 ? 'is-complete' : ''} ${currentStep === 4 ? 'is-active' : ''}`}>
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