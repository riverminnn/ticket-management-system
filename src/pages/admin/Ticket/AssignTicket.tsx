import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faSpinner, faUsers, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { API_CONFIG } from '../../../config/api';

interface AssignTicketProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId: number;
    onSuccess: () => void;
}

interface User {
    id: number;
    fullName: string;
}

interface Department {
    id: number;
    name: string;
}

export default function AssignTicket({ isOpen, onClose, ticketId, onSuccess }: AssignTicketProps) {
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
    const [notes, setNotes] = useState('');

    const [loading, setLoading] = useState(false);
    const [fetchingDepartments, setFetchingDepartments] = useState(false);
    const [fetchingUsers, setFetchingUsers] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchDepartments();
        } else {
            // Reset state when modal closes
            setSelectedUsers([]);
            setUsers([]);
            setSelectedDepartment(null);
            setNotes('');
            setSearchTerm('');
            setError('');
        }
    }, [isOpen]);

    const fetchDepartments = async () => {
        try {
            setFetchingDepartments(true);
            setError('');

            const response = await fetch(`${API_CONFIG.baseUrl}/department/get_all`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_CONFIG.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch departments');
            }

            const result = await response.json();
            console.log('Departments response:', result);

            if (result.success && result.data) {
                setDepartments(result.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err: any) {
            console.error('Error fetching departments:', err);
            setError('Không thể tải danh sách phòng ban');
        } finally {
            setFetchingDepartments(false);
        }
    };

    const fetchUsersByDepartment = async (departmentId: number) => {
        try {
            setFetchingUsers(true);
            setError('');
            setUsers([]);
            setSelectedUsers([]);

            const response = await fetch(`${API_CONFIG.baseUrl}/user/get_by_department?departmentId=${departmentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_CONFIG.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const result = await response.json();
            console.log('Users response:', result);

            if (result.success && result.data) {
                setUsers(result.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError('Không thể tải danh sách nhân viên');
        } finally {
            setFetchingUsers(false);
        }
    };

    const handleDepartmentChange = (departmentId: number) => {
        setSelectedDepartment(departmentId);
        fetchUsersByDepartment(departmentId);
    };

    const handleAssign = async () => {
        if (selectedUsers.length === 0) {
            setError('Vui lòng chọn ít nhất một người xử lý');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await fetch(`${API_CONFIG.baseUrl}/Ticket/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_CONFIG.getToken()}`
                },
                body: JSON.stringify({
                    ticketId,
                    assigneeIds: selectedUsers,
                    note: notes
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                if (errorData && errorData.error) {
                    throw new Error(errorData.error.description || errorData.error.message);
                }
                throw new Error('Failed to assign ticket');
            }

            const result = await response.json();
            console.log('Assign response:', result);

            if (result.success) {
                onSuccess();
                onClose();
            } else {
                throw new Error(result.error?.description || 'Failed to assign ticket');
            }
        } catch (err: any) {
            console.error('Error assigning ticket:', err);
            setError(err.message || 'Không thể phân công yêu cầu');
        } finally {
            setLoading(false);
        }
    };

    const toggleUser = (userId: number) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faUserPlus} className="text-blue-600 text-xl" />
                        <h2 className="text-xl font-bold text-gray-900">Phân công yêu cầu #{ticketId}</h2>
                    </div>
                    <button
                        onClick={onClose}
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

                    {/* Department Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                            Chọn phòng ban <span className="text-red-500">*</span>
                        </label>
                        {fetchingDepartments ? (
                            <div className="flex items-center justify-center py-4">
                                <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-xl mr-2" />
                                <span className="text-gray-600">Đang tải phòng ban...</span>
                            </div>
                        ) : (
                            <select
                                value={selectedDepartment || ''}
                                onChange={(e) => handleDepartmentChange(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">-- Chọn phòng ban --</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* User Selection */}
                    {selectedDepartment && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FontAwesomeIcon icon={faUsers} className="mr-2" />
                                    Tìm kiếm nhân viên
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên nhân viên..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* User List */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Chọn người xử lý <span className="text-red-500">*</span>
                                </h3>
                                {fetchingUsers ? (
                                    <div className="flex items-center justify-center py-8">
                                        <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-2xl" />
                                    </div>
                                ) : filteredUsers.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        {users.length === 0 ? 'Không có nhân viên nào trong phòng ban này' : 'Không tìm thấy nhân viên nào'}
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {filteredUsers.map(user => (
                                            <div
                                                key={user.id}
                                                onClick={() => toggleUser(user.id)}
                                                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                                                    selectedUsers.includes(user.id)
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => {}}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{user.fullName}</div>
                                                    <div className="text-xs text-gray-500">ID: {user.id}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Notes */}
                    {selectedUsers.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ghi chú (tùy chọn)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                placeholder="Thêm ghi chú về công việc cần làm..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>
                    )}

                    {/* Selected Count */}
                    {selectedUsers.length > 0 && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-700">
                                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                                Đã chọn <span className="font-semibold">{selectedUsers.length}</span> người xử lý
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedUsers.map(userId => {
                                    const user = users.find(u => u.id === userId);
                                    return user ? (
                                        <span key={userId} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                            {user.fullName}
                                            <button
                                                onClick={() => toggleUser(userId)}
                                                className="hover:text-blue-900"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={loading || selectedUsers.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {loading && <FontAwesomeIcon icon={faSpinner} spin />}
                        <FontAwesomeIcon icon={faUserPlus} />
                        <span>Phân công ({selectedUsers.length})</span>
                    </button>
                </div>
            </div>
        </div>
    );
}