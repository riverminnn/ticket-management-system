import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { API_CONFIG } from '../../../config/api';

interface RejectTicketProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId: number;
    ticketTitle?: string;
    onSuccess: () => void;
}

const REJECT_REASONS = [
    'Yêu cầu không rõ ràng',
    'Yêu cầu không hợp lệ',
    'Thiếu thông tin cần thiết',
    'Yêu cầu trùng lặp',
    'Ngoài phạm vi hỗ trợ',
    'Không đủ tài nguyên',
    'Khác'
];

export default function RejectTicket({ isOpen, onClose, ticketId, ticketTitle, onSuccess }: RejectTicketProps) {
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleReject = async () => {
        const finalReason = selectedReason === 'Khác' ? customReason : selectedReason;

        if (!finalReason.trim()) {
            setError('Vui lòng chọn hoặc nhập lý do từ chối');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await fetch(`${API_CONFIG.baseUrl}/Ticket/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${API_CONFIG.getToken()}`
                },
                body: JSON.stringify({
                    ticketId,
                    reason: finalReason,
                    // notes: additionalNotes
                })
            });

            if (!response.ok) {
                throw response;
            }

            onSuccess();
            handleClose();
        } catch (err: any) {
            console.error('Error rejecting ticket:', err);

            // --- THIS IS THE NEW ERROR HANDLING ---
            if (err instanceof Response) {
                try {
                    const errorData = await err.json();
                    // This is the format from your ExceptionHandlerMiddleWare.cs
                    setError(errorData.error.description || 'Lỗi không xác định từ máy chủ');
                } catch (jsonError) {
                    setError(`Lỗi: ${err.status} - ${err.statusText}`);
                }
            } else {
                setError(err.message || 'Không thể từ chối yêu cầu');
            }
            // --- END OF NEW ERROR HANDLING ---
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedReason('');
        setCustomReason('');
        setAdditionalNotes('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faCircleXmark} className="text-red-600 text-xl" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Từ chối yêu cầu #{ticketId}</h2>
                            {ticketTitle && (
                                <p className="text-sm text-gray-600 mt-1">{ticketTitle}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-auto p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Warning Message */}
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            <strong>Lưu ý:</strong> Hành động này sẽ từ chối yêu cầu và thông báo cho người tạo.
                            Vui lòng cung cấp lý do rõ ràng để người tạo hiểu và có thể tạo lại yêu cầu hợp lệ.
                        </p>
                    </div>

                    {/* Reject Reasons */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Lý do từ chối <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                            {REJECT_REASONS.map(reason => (
                                <label
                                    key={reason}
                                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                                        selectedReason === reason
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={reason}
                                        checked={selectedReason === reason}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                    />
                                    <span className="ml-3 text-sm text-gray-900">{reason}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Custom Reason Input */}
                    {selectedReason === 'Khác' && (
                        <div className="mb-6">
                            <label htmlFor="customReason" className="block text-sm font-medium text-gray-700 mb-2">
                                Nhập lý do cụ thể <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="customReason"
                                type="text"
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Nhập lý do từ chối..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={loading || !selectedReason || (selectedReason === 'Khác' && !customReason.trim())}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {loading && <FontAwesomeIcon icon={faSpinner} spin />}
                        <span>Từ chối yêu cầu</span>
                    </button>
                </div>
            </div>
        </div>
    );
}