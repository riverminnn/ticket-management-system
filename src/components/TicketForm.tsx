import { useState } from 'react';
import Timeline from './Timeline'
import React from 'react';

export default function TicketForm() {
    const [comment, setComment] = useState('');

    const timelineData = [
        {
            status: 'Tạo mới',
            date: '16h:00 16/08/2022',
            executor: 'Acc-Email',
            completed: true
        },
        {
            status: 'Đã tiếp nhận',
            date: '16h:00 16/08/2022',
            executor: 'HanVTN3 - SD',
            completed: true
        },
        {
            status: 'Đang thực hiện',
            date: '16h:00 16/08/2022',
            executor: 'HanVTN3 - SD',
            completed: false,
            current: true
        },
        {
            status: 'Đang thực hiện',
            date: '20h:00 18/08/2022',
            executor: 'DaoTTM - SD',
            completed: false
        },
        {
            status: 'Trạng thái',
            date: 'Thời gian thực hiện',
            executor: 'Người thực hiện - Phòng',
            completed: false
        }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Main Content */}
            <div className="flex-1 flex">
                <div className="flex-1 bg-white">

                    {/* Header with Actions */}
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-semibold">Chi tiết yêu cầu hỗ trợ</h1>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                                    <span>⊕</span>
                                    <span>Phân công</span>
                                    <span>⊖</span>
                                </button>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Đã tiếp nhận
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                                    <span>⊙</span>
                                    <span>Lưu</span>
                                    <span>⊖</span>
                                </button>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
                            <h3 className="font-semibold mb-3">Mô tả yêu cầu</h3>
                            <p className="text-sm text-gray-700 mb-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                                aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                                aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-600">File đính kèm:</span>
                                <button className="text-blue-600 hover:underline flex items-center gap-1">
                                    <span>📎</span>
                                    <span>See more</span>
                                </button>
                            </div>
                        </div>

                        {/* Technical Details Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm mb-2">Thời gian mong muốn hoàn thành</label>
                                    <input
                                        type="text"
                                        placeholder="MM / DD / YYYY"
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-2">Dự án/Ứng dụng</label>
                                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                                        <option>FM v1.2</option>
                                    </select>
                                </div>
                            </div>

                            <h3 className="font-semibold mb-4">Chi tiết kỹ thuật</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm mb-2">Thời gian dự kiến bắt đầu</label>
                                        <input
                                            type="text"
                                            placeholder="MM / DD / YYYY"
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-2">Nhân sự QA tiếp nhận</label>
                                        <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                                            <option>PhuongTTT28</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-2">Nhân sự xử lý</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Default"
                                                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                            />
                                            <button className="px-3 border border-gray-300 rounded">👁️</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm mb-2">Thời gian dự kiến hoàn thành</label>
                                        <input
                                            type="text"
                                            placeholder="MM / DD / YYYY"
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-2">Phân loại nguồn nhân</label>
                                        <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                                            <option>Data</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-2">Nguồn nhân</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Input text"
                                                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                            />
                                            <button className="px-3 border border-gray-300 rounded">👁️</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Discussion Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
                            <h3 className="font-semibold mb-4">Nội dung trao đổi</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white">
                                        📧
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm">@Người gửi - @Ngày giờ gửi</span>
                                        </div>
                                        <div className="text-sm font-medium mb-1">Tiêu đề email</div>
                                        <div className="text-sm text-gray-600">Nội dung email (một phần)</div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-cyan-400 rounded flex items-center justify-center text-white">
                                        📧
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm">@Người gửi - @Ngày giờ gửi</span>
                                        </div>
                                        <div className="text-sm font-medium mb-1">Tiêu đề email</div>
                                        <div className="text-sm text-gray-600">Nội dung email (một phần)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Internal Discussion */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="font-semibold mb-4">Thảo luận nội bộ</h3>
                            <div className="mb-4">
                                <div className="flex gap-3 mb-4">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                                        Y
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-gray-100 rounded-lg p-3 mb-1">
                                            <p className="text-sm">
                                                Sometimes users prefer simplicity over all of the detailed writing information Word Counter provides, and this is
                                                exactly what this tool offers. It's a 100% free online character count calculator that's simple to use.
                                            </p>
                                        </div>
                                        <div className="text-xs text-gray-500">yediz2 &nbsp;&nbsp;&nbsp; 04:12 - 21/02/2024</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Nhập nội dung..."
                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm"
                                />
                                <button className="bg-green-500 text-white px-3 py-2 rounded-full hover:bg-green-600">
                                    ✓
                                </button>
                                <button className="bg-blue-500 text-white px-3 py-2 rounded-full hover:bg-blue-600">
                                    📎
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Timeline */}
                <div className="w-80 bg-white border-l border-gray-200 p-6">
                    <div className="mb-6">
                        <div className="text-xs text-gray-500 mb-4">
                            Tạo bởi: @Acc tạo lúc: @Thời gian tạo (năm tháng ngày giờ phút giây)
                        </div>
                    </div>

                    <h3 className="font-semibold mb-6">Tiến trình xử lý</h3>
                    <Timeline items={timelineData} />
                </div>
            </div>
        </div>
    );
}