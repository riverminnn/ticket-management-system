import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPaperclip,
    faSpinner,
    faArrowLeft,
    faExclamationCircle,
    faCheck,
    faCircle,
    faClock,
    faUser,
    faCalendar,
    faBuilding
} from '@fortawesome/free-solid-svg-icons';
import { API_CONFIG } from '../../config/api';
import './Tickets.css';

interface ITicketDetail {
    title?: string;
    causeType?: string;
    implementationPlan?: string;
    assigneeNames?: string;
    category: string;
    project: string;
    headDepartment?: string;
    content: string;
    desiredCompleteDate: string;
    expectedStartDate?: string;
    expectedCompleteDate?: string;
    fileUrls: string[];
    status?: string;
    priority?: string;
    creator?: string;
    createAt?: string;
}

interface TimelineItem {
    status: string;
    date: string;
    executor: string;
    completed: boolean;
    current?: boolean;
}

export default function Ticket() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState<ITicketDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const fetchTicketDetail = async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError('');
            console.log('Fetching ticket detail for ID:', id);

            const response = await fetch(`${API_CONFIG.baseUrl}/Ticket/get_detail?ticketId=${id}`, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_CONFIG.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);

            if (result.success && result.data) {
                setTicket(result.data);
            } else {
                throw new Error(result.error?.message || 'Failed to fetch ticket details');
            }
        } catch (err: any) {
            console.error('Error fetching ticket:', err);
            setError(err.message || 'Failed to load ticket details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicketDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-5xl mb-4" />
                    <p className="text-gray-600 text-lg">Đang tải chi tiết yêu cầu...</p>
                </div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
                    <div className="flex flex-col items-center text-center">
                        <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 text-5xl mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Không thể tải yêu cầu</h2>
                        <p className="text-gray-600 mb-6">{error || 'Yêu cầu không tồn tại'}</p>
                        <button
                            onClick={() => navigate('/user/tickets')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Mock timeline data - in real implementation, this would come from API
    const timelineItems: TimelineItem[] = [
        { status: 'Chờ tiếp nhận', date: ticket.createAt || new Date().toISOString(), executor: ticket.creator || 'Hệ thống', completed: true },
        { status: 'Đã tiếp nhận', date: new Date().toISOString(), executor: ticket.headDepartment || 'Chưa có', completed: false, current: true },
        { status: 'Đang xử lý', date: '', executor: ticket.assigneeNames || 'Chưa có', completed: false },
        { status: 'Hoàn thành', date: ticket.expectedCompleteDate || '', executor: ticket.assigneeNames || 'Chưa có', completed: false }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/user/tickets')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Quay lại danh sách</span>
                    </button>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-sm font-semibold text-blue-600">TICKET #{id}</span>
                                    {ticket.status && (
                                        <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
                                            {ticket.status}
                                        </span>
                                    )}
                                    {ticket.priority && (
                                        <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                                            {ticket.priority}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                                    {ticket.title || `Chi tiết yêu cầu #${id}`}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faBuilding} className="text-gray-400" />
                                        <span>Danh mục: <span className="font-semibold text-gray-900">{ticket.category}</span></span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center gap-2">
                                        <span>Dự án: <span className="font-semibold text-gray-900">{ticket.project}</span></span>
                                    </div>
                                    {ticket.createAt && (
                                        <>
                                            <span>•</span>
                                            <div className="flex items-center gap-2">
                                                <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                                                <span>Tạo lúc: {new Date(ticket.createAt).toLocaleString('vi-VN')}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">Mô tả yêu cầu</h3>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {ticket.content}
                            </p>
                        </div>

                        {/* Attachments */}
                        {ticket.fileUrls && ticket.fileUrls.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-4">File đính kèm</h3>
                                <div className="flex flex-wrap gap-2">
                                    {ticket.fileUrls.map((url, index) => (
                                        <a
                                            key={index}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                                        >
                                            <FontAwesomeIcon icon={faPaperclip} />
                                            <span className="text-sm font-medium">File {index + 1}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Info */}
                        {(ticket.causeType || ticket.implementationPlan) && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
                                <div className="space-y-4">
                                    {ticket.causeType && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Loại nguyên nhân:</span>
                                            <p className="text-sm text-gray-900 mt-1">{ticket.causeType}</p>
                                        </div>
                                    )}
                                    {ticket.implementationPlan && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Kế hoạch thực hiện:</span>
                                            <p className="text-sm text-gray-900 mt-1">{ticket.implementationPlan}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Ticket Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">Thông tin chi tiết</h3>
                            <div className="space-y-4">
                                {ticket.headDepartment && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                            <FontAwesomeIcon icon={faUser} className="w-4" />
                                            <span className="font-medium">Trưởng phòng phụ trách</span>
                                        </div>
                                        <p className="text-sm text-gray-900 ml-6">{ticket.headDepartment}</p>
                                    </div>
                                )}
                                {ticket.assigneeNames && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                            <FontAwesomeIcon icon={faUser} className="w-4" />
                                            <span className="font-medium">Người xử lý</span>
                                        </div>
                                        <p className="text-sm text-gray-900 ml-6">{ticket.assigneeNames}</p>
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <FontAwesomeIcon icon={faCalendar} className="w-4" />
                                        <span className="font-medium">Thời gian mong muốn</span>
                                    </div>
                                    <p className="text-sm text-gray-900 ml-6">
                                        {new Date(ticket.desiredCompleteDate).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                {ticket.expectedStartDate && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                            <FontAwesomeIcon icon={faCalendar} className="w-4" />
                                            <span className="font-medium">Ngày bắt đầu dự kiến</span>
                                        </div>
                                        <p className="text-sm text-gray-900 ml-6">
                                            {new Date(ticket.expectedStartDate).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                )}
                                {ticket.expectedCompleteDate && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                            <FontAwesomeIcon icon={faCalendar} className="w-4" />
                                            <span className="font-medium">Ngày hoàn thành dự kiến</span>
                                        </div>
                                        <p className="text-sm text-gray-900 ml-6">
                                            {new Date(ticket.expectedCompleteDate).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Progress Timeline */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">Tiến độ xử lý</h3>
                            <div className="timeline-container">
                                {timelineItems.map((item, index) => (
                                    <div key={index} className="timeline-item">
                                        <div className="timeline-track">
                                            <div className={`timeline-circle ${
                                                item.completed ? 'completed' : item.current ? 'current' : 'pending'
                                            }`}>
                                                {item.completed ? (
                                                    <FontAwesomeIcon icon={faCheck} className="text-white text-sm" />
                                                ) : item.current ? (
                                                    <div className="w-3.5 h-3.5 rounded-full bg-white"></div>
                                                ) : (
                                                    <FontAwesomeIcon icon={faCircle} className="text-gray-400 text-xs" />
                                                )}
                                            </div>
                                            {index < timelineItems.length - 1 && (
                                                <div className={`timeline-line ${item.completed ? 'completed' : 'pending'}`}></div>
                                            )}
                                        </div>
                                        <div className="timeline-content">
                                            <h4 className={`timeline-title ${item.completed || item.current ? 'active' : 'inactive'}`}>
                                                {item.status}
                                            </h4>
                                            <div className={`timeline-details ${item.completed || item.current ? 'active' : 'inactive'}`}>
                                                {item.date && <p>Ngày: {new Date(item.date).toLocaleDateString('vi-VN')}</p>}
                                                <p>Thực hiện: {item.executor}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}