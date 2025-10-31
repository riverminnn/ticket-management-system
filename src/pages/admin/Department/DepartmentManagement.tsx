import { useEffect, useState } from 'react';
import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    type Department,
    type CreateDepartmentDto,
    type UpdateDepartmentDto
} from '../../../api/api';

export default function DepartmentManagement() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
    
    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    // Fetch departments on mount
    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You must be logged in to access this page. Please login first.');
            return;
        }
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            setError(''); // Clear previous errors
            const data = await getAllDepartments();
            setDepartments(data);
        } catch (err) {
            let errorMessage = err instanceof Error ? err.message : 'Failed to load departments';
            
            // Better error messages
            if (errorMessage.includes('401')) {
                errorMessage = '🔐 Unauthorized: Please login first or your session has expired.';
            } else if (errorMessage.includes('403')) {
                errorMessage = '⛔ Forbidden: You don\'t have permission to access departments. Admin role required.';
            } else if (errorMessage.includes('500')) {
                errorMessage = '⚠️ Server Error: Please try again later or contact support.';
            }
            
            setError(errorMessage);
            console.error('Fetch departments error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setIsEditMode(false);
        setCurrentDepartment(null);
        setFormData({ name: '', description: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (department: Department) => {
        setIsEditMode(true);
        setCurrentDepartment(department);
        setFormData({
            name: department.name,
            description: department.description || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (departmentId: number) => {
        if (!confirm('Are you sure you want to delete this department?')) return;

        try {
            setLoading(true);
            await deleteDepartment(departmentId);
            setSuccess('Department deleted successfully!');
            fetchDepartments();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete department');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            if (isEditMode && currentDepartment) {
                const updateData: UpdateDepartmentDto = {
                    id: currentDepartment.id,
                    name: formData.name,
                    description: formData.description || undefined
                };
                await updateDepartment(updateData);
                setSuccess('Department updated successfully!');
            } else {
                const createData: CreateDepartmentDto = {
                    name: formData.name,
                    description: formData.description || undefined
                };
                await createDepartment(createData);
                setSuccess('Department created successfully!');
            }
            
            setIsModalOpen(false);
            fetchDepartments();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Department Management</h1>
                    <p className="text-gray-600 mt-1">Manage all departments in the system</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-200 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Department
                </button>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                    {success}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading && !isModalOpen && (
                <div className="flex justify-center items-center py-12">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            )}

            {/* Departments Table */}
            {!loading && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {departments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No departments found. Create one to get started!
                                    </td>
                                </tr>
                            ) : (
                                departments.map((dept) => (
                                    <tr key={dept.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm text-gray-900">{dept.id}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{dept.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{dept.description || '-'}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(dept)}
                                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(dept.id)}
                                                className="text-red-600 hover:text-red-900 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {isEditMode ? 'Edit Department' : 'Create Department'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Department Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    placeholder="e.g., IT Department"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    placeholder="Brief description of the department"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
