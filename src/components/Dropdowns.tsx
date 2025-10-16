import {useState, useRef, useEffect} from 'react';

// Status Dropdown with colors
export function StatusDropdown({value, onChange}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const statuses = [
        {value: 'da-tiep-nhan', label: 'Đã tiếp nhận', color: 'bg-cyan-500'},
        {value: 'da-xu-ly', label: 'Đã xử lý', color: 'bg-green-500'},
        {value: 'tu-choi', label: 'Từ chối', color: 'bg-pink-500'},
        {value: 'chua-tiep-nhan', label: 'Chưa tiếp nhận', color: 'bg-orange-500'}
    ];

    const selectedStatus = statuses.find(s => s.value === value) || statuses[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="text-xs text-gray-600 mb-1">Trạng thái</div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${selectedStatus.color} text-white px-4 py-2 rounded flex items-center justify-between w-48`}
            >
                <span>{selectedStatus.label}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 overflow-hidden">
                    {statuses.map((status) => (
                        <button
                            key={status.value}
                            onClick={() => {
                                onChange(status.value);
                                setIsOpen(false);
                            }}
                            className={`${status.color} text-white px-4 py-3 w-full text-left hover:opacity-90 transition-opacity`}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Resource Classification Dropdown
export function ResourceDropdown({value, onChange}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const options = [
        'Network',
        'Hệ thống',
        'Quy trình nghiệp vụ',
        'Data',
        'Khác'
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm text-gray-600 mb-1">Phân loại nguồn nhân</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border border-gray-300 rounded px-4 py-2 flex items-center justify-between bg-white hover:border-gray-400 transition-colors"
            >
                <span className="text-gray-700">{value || 'Network'}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
                </svg>
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-50 max-h-64 overflow-y-auto">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                                value === option ? 'bg-gray-100 font-semibold text-gray-800' : 'text-gray-700'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Implementation Method Dropdown
export function ImplementationDropdown({value, onChange}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const options = [
        'Cập nhật dữ liệu',
        'Hỗ trợ giải đáp thông tin',
        'Hot-fix',
        'Hot Request',
        'Move to next version',
        'Yêu cầu tư vấn giải pháp'
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm text-gray-600 mb-1">Phương án thực hiện</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border border-gray-300 rounded px-4 py-2 flex items-center justify-between bg-white hover:border-gray-400 transition-colors"
            >
                <span className="text-gray-700">{value || 'Cập nhật dữ liệu'}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
                </svg>
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-50 max-h-64 overflow-y-auto">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                                value === option ? 'bg-gray-100 font-semibold text-gray-800' : 'text-gray-700'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}