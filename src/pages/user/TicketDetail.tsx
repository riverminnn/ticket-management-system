import { useState } from 'react';
import Timeline from '../../shared/components/Timeline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSave,
    faUserPlus,
    faCheck,
    faPaperclip,
    faEnvelope,
    faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

export default function TicketDetail() {
    const [comment, setComment] = useState('');
    const [formData, setFormData] = useState({
        desiredCompletionDate: '',
        project: 'FM v1.2',
        startDate: '',
        endDate: '',
        qaPersonnel: 'PhuongTTT28',
        handler: '',
        resourceType: 'Data',
        resource: ''
    });

    const timelineData = [
        {
            id: '1',
            status: 'Tạo mới',
            date: '16h:00 16/08/2022',
            executor: 'Acc-Email',
            completed: true
        },
        {
            id: '2',
            status: 'Đã tiếp nhận',
            date: '16h:00 16/08/2022',
            executor: 'HanVTN3 - SD',
            completed: true
        },
        {
            id: '3',
            status: 'Đang thực hiện',
            date: '16h:00 16/08/2022',
            executor: 'HanVTN3 - SD',
            completed: false,
            current: true
        },
        {
            id: '4',
            status: 'Đang thực hiện',
            date: '20h:00 18/08/2022',
            executor: 'DaoTTM - SD',
            completed: false
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleCommentSubmit = () => {
        console.log('Comment:', comment);
        setComment('');
    };

    return (
        <div className="flex h-full bg-gray-50">
            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    {/* Header with Actions */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Chi tiết yêu cầu hỗ trợ</h1>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                <FontAwesomeIcon icon={faUserPlus} />
                                <span>Phân công</span>
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <FontAwesomeIcon icon={faCheck} />
                                <span>Đã tiếp nhận</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                <FontAwesomeIcon icon={faSave} />
                                <span>Lưu</span>
                            </button>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-3">Mô tả yêu cầu</h3>
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                            aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">File đính kèm:</span>
                            <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                <FontAwesomeIcon icon={faPaperclip} />
                                <span>See more</span>
                            </button>
                        </div>
                    </div>

                    {/* Technical Details Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">Thời gian mong muốn hoàn thành</label>
                                    <input
                                        type="text"
                                        placeholder="MM / DD / YYYY"
                                        value={formData.desiredCompletionDate}
                                        onChange={(e) => setFormData({...formData, desiredCompletionDate: e.target.value})}
                                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">Dự án/Ứng dụng</label>
                                    <select 
                                        value={formData.project}
                                        onChange={(e) => setFormData({...formData, project: e.target.value})}
                                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option>FM v1.2</option>
                                        <option>FTI-FPMS</option>
                                        <option>Leasedline</option>
                                    </select>
                                </div>
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-4">Chi tiết kỹ thuật</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-2">Thời gian dự kiến bắt đầu</label>
                                        <input
                                            type="text"
                                            placeholder="MM / DD / YYYY"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-2">Nhân sự QA tiếp nhận</label>
                                        <select 
                                            value={formData.qaPersonnel}
                                            onChange={(e) => setFormData({...formData, qaPersonnel: e.target.value})}
                                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option>PhuongTTT28</option>
                                            <option>HangBT13</option>
                                            <option>ThinhNH</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-2">Nhân sự xử lý</label>
                                        <input
                                            type="text"
                                            placeholder="Default"
                                            value={formData.handler}
                                            onChange={(e) => setFormData({...formData, handler: e.target.value})}
                                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-2">Thời gian dự kiến hoàn thành</label>
                                        <input
                                            type="text"
                                            placeholder="MM / DD / YYYY"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-2">Phân loại nguồn nhân</label>
                                        <select 
                                            value={formData.resourceType}
                                            onChange={(e) => setFormData({...formData, resourceType: e.target.value})}
                                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option>Data</option>
                                            <option>Development</option>
                                            <option>QA</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-2">Nguồn nhân</label>
                                        <input
                                            type="text"
                                            placeholder="Input text"
                                            value={formData.resource}
                                            onChange={(e) => setFormData({...formData, resource: e.target.value})}
                                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Discussion Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4">Nội dung trao đổi</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm text-gray-900">@Người gửi - @Ngày giờ gửi</span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 mb-1">Tiêu đề email</div>
                                    <div className="text-sm text-gray-600">Nội dung email (một phần)</div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-10 h-10 bg-cyan-500 rounded flex items-center justify-center text-white">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm text-gray-900">@Người gửi - @Ngày giờ gửi</span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 mb-1">Tiêu đề email</div>
                                    <div className="text-sm text-gray-600">Nội dung email (một phần)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Internal Discussion */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4">Thảo luận nội bộ</h3>
                        <div className="mb-4">
                            <div className="flex gap-3 mb-4">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-700 font-semibold">
                                    Y
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-1">
                                        <p className="text-sm text-gray-700">
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
                                className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button 
                                onClick={handleCommentSubmit}
                                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
                            >
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
                                <FontAwesomeIcon icon={faPaperclip} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Timeline */}
            <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-auto shadow-sm">
                <div className="mb-6">
                    <div className="text-xs text-gray-500 mb-4">
                        Tạo bởi: @Acc tạo lúc: @Thời gian tạo (năm tháng ngày giờ phút giây)
                    </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-6">Tiến trình xử lý</h3>
                <Timeline items={timelineData} />
            </div>
        </div>
    );
}
