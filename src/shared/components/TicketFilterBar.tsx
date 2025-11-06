import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSortUp, faSortDown, faFilter } from "@fortawesome/free-solid-svg-icons";

interface FilterBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedPriority: string;
    setSelectedPriority: (value: string) => void;
    selectedStatus: string;
    setSelectedStatus: (value: string) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    sortField: string | null;
    sortDirection: "asc" | "desc";
    handleSort: (field: string) => void;
    clearFilters: () => void;
    uniquePriorities: string[];
    uniqueStatuses: string[];
    uniqueCategories: string[];
    isFilterMenuOpen: boolean;
    toggleFilterMenu: () => void;
}

const TicketFilterBar = ({
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
    clearFilters,
    uniquePriorities,
    uniqueStatuses,
    uniqueCategories,
    isFilterMenuOpen,
    toggleFilterMenu
}: FilterBarProps) => {
    return (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <FontAwesomeIcon 
                        icon={faSearch} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã yêu cầu, tiêu đề, danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 pl-10 w-full bg-white border border-gray-300 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                {/* Filter Toggle Button for Mobile */}
                <div className="md:hidden">
                    <button
                        onClick={toggleFilterMenu}
                        className="w-full bg-white border border-gray-300 text-gray-700 p-2 rounded flex items-center justify-center gap-2"
                    >
                        <FontAwesomeIcon icon={faFilter} />
                        <span>Bộ lọc và Sắp xếp</span>
                    </button>
                </div>

                {/* Filters and Sort Section */}
                <div className={`${isFilterMenuOpen ? 'block' : 'hidden md:block'} space-y-4`}>
                    {/* Filter Options */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Mức độ ưu tiên
                            </label>
                            <select
                                value={selectedPriority}
                                onChange={(e) => setSelectedPriority(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                            >
                                <option value="">Tất cả</option>
                                {uniquePriorities.map(priority => (
                                    <option key={priority} value={priority}>{priority}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Trạng thái
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                            >
                                <option value="">Tất cả</option>
                                {uniqueStatuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Danh mục
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                            >
                                <option value="">Tất cả</option>
                                {uniqueCategories.map(category => (
                                    <option key={category} value={category}>Danh mục {category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-medium transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>

                    {/* Sort Controls */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Sắp xếp theo:</span>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { field: "id", label: "Mã YC" },
                                { field: "title", label: "Tiêu đề" },
                                { field: "priority", label: "Ưu tiên" },
                                { field: "status", label: "Trạng thái" },
                                { field: "createdAt", label: "Ngày tạo" }
                            ].map((item) => (
                                <button
                                    key={item.field}
                                    onClick={() => handleSort(item.field)}
                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1 ${
                                        sortField === item.field
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                                    }`}
                                >
                                    {item.label}
                                    {sortField === item.field && (
                                        <FontAwesomeIcon
                                            icon={sortDirection === "asc" ? faSortUp : faSortDown}
                                            className="ml-1"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Active Filters Display */}
                {(selectedPriority || selectedStatus || selectedCategory || searchTerm) && (
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-medium text-gray-600">Đang lọc:</span>
                        {searchTerm && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                Tìm kiếm: "{searchTerm}"
                            </span>
                        )}
                        {selectedPriority && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                Ưu tiên: {selectedPriority}
                            </span>
                        )}
                        {selectedStatus && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                Trạng thái: {selectedStatus}
                            </span>
                        )}
                        {selectedCategory && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                                Danh mục: {selectedCategory}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketFilterBar;
