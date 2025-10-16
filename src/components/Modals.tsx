import {useState} from 'react';

// Notification Modal
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export function NotificationModal({isOpen, onClose, message}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-96 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                >
                    ✕
                </button>
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-center mb-6">Thông báo</h3>
                    <div className="border-t-2 border-cyan-500 pt-6">
                        <p className="text-center text-gray-700 mb-6">
                            {message || 'Lưu phiếu yêu cầu thành công'}
                        </p>
                        <div className="flex justify-center">
                            <svg className="w-16 h-16 text-green-500" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Assignment Modal
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export function AssignmentModal({isOpen, onClose}) {
    const [formData, setFormData] = useState({
        phongBan: '',
        nhanVien: '',
        ghiChu: ''
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-[480px] relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                >
                    ✕
                </button>
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-center mb-6">Phân công</h3>
                    <div className="border-t-2 border-cyan-500 pt-6">
                        <p className="text-center text-gray-700 mb-6">
                            Chọn phòng ban/Nhân sự muốn phân công.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Phòng ban</label>
                                <select
                                    className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-700"
                                    value={formData.phongBan}
                                    onChange={(e) => setFormData({...formData, phongBan: e.target.value})}
                                >
                                    <option value="">Text</option>
                                    <option value="network">Network</option>
                                    <option value="it">IT Support</option>
                                    <option value="dev">Development</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Nhân sự</label>
                                <select
                                    className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-700"
                                    value={formData.nhanVien}
                                    onChange={(e) => setFormData({...formData, nhanVien: e.target.value})}
                                >
                                    <option value="">Text</option>
                                    <option value="nv1">Nhân viên 1</option>
                                    <option value="nv2">Nhân viên 2</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Ghi chú</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Text"
                                    value={formData.ghiChu}
                                    onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
                                />
                            </div>

                            <div className="flex justify-center pt-2">
                                <button
                                    onClick={onClose}
                                    className="bg-blue-900 text-white px-8 py-2 rounded hover:bg-blue-800 font-medium"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reject Request Modal
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export function RejectModal({isOpen, onClose}) {
    const [reason, setReason] = useState('');
    const [note, setNote] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-[480px] relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                >
                    ✕
                </button>
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-center mb-6">Từ chối yêu cầu</h3>
                    <div className="border-t-2 border-cyan-500 pt-6">
                        <p className="text-center text-gray-700 mb-6">
                            Bạn xác nhận từ chối yêu cầu này?
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Lý do từ chối?</label>
                                <select
                                    className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-700"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                >
                                    <option value="">Text</option>
                                    <option value="reason1">Không đủ thông tin</option>
                                    <option value="reason2">Vượt quá phạm vi</option>
                                    <option value="reason3">Không khả thi</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Khác</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Text"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-center gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="bg-red-500 text-white px-8 py-2 rounded hover:bg-red-600 font-medium"
                                >
                                    Từ chối
                                </button>
                                <button
                                    onClick={onClose}
                                    className="bg-blue-900 text-white px-8 py-2 rounded hover:bg-blue-800 font-medium"
                                >
                                    Quay lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}