import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPencilAlt,
  faTrash,
  faSpinner,
  faTicket,
  faSearch,
  faSortUp,
  faSortDown,
  faFilter,
  faEye
} from "@fortawesome/free-solid-svg-icons";

interface ITicket {
  id: string;
  title: string;
  categoryId: string;
  creatorId: string;
  headDepartmentId: string;
  content: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Đang thực hiện" | "Chờ phê duyệt" | "Hoàn thành" | "Đã hủy";
  createdAt: string;
}

const TicketManagement = () => {
  // Fixed data for tickets
  const initialTickets: ITicket[] = [
    {
      id: "3151",
      title: "[TMS-FM] Bổ sung thêm các trường thông tin chi tiết cước - Phục vụ báo cáo trên HRM",
      categoryId: "CAT1",
      creatorId: "TruongLA",
      headDepartmentId: "HEAD1",
      content: "Content",
      priority: "High",
      status: "Đang thực hiện",
      createdAt: "2024-10-16"
    },
    {
      id: "3152",
      title: "[TMS-HR] Cập nhật module quản lý nhân sự",
      categoryId: "CAT2",
      creatorId: "NguyenVA",
      headDepartmentId: "HEAD2",
      content: "Nội dung chi tiết về việc cập nhật module HR",
      priority: "Medium",
      status: "Chờ phê duyệt",
      createdAt: "2024-10-15"
    },
    {
      id: "3153",
      title: "[TMS-FIN] Tích hợp hệ thống thanh toán mới",
      categoryId: "CAT3",
      creatorId: "LeMB",
      headDepartmentId: "HEAD1",
      content: "Yêu cầu tích hợp gateway thanh toán VNPay",
      priority: "Critical",
      status: "Đang thực hiện",
      createdAt: "2024-10-14"
    },
    {
      id: "3154",
      title: "[TMS-SEC] Nâng cấp bảo mật hệ thống",
      categoryId: "CAT4",
      creatorId: "TranDC",
      headDepartmentId: "HEAD3",
      content: "Cập nhật các biện pháp bảo mật mới",
      priority: "High",
      status: "Hoàn thành",
      createdAt: "2024-10-13"
    },
    {
      id: "3155",
      title: "[TMS-UI] Thiết kế lại giao diện admin",
      categoryId: "CAT5",
      creatorId: "PhamTH",
      headDepartmentId: "HEAD2",
      content: "Cải thiện UX/UI cho trang quản trị",
      priority: "Low",
      status: "Đã hủy",
      createdAt: "2024-10-12"
    }
  ];

  const [tickets, setTickets] = useState<ITicket[]>(initialTickets);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredTickets, setFilteredTickets] = useState<ITicket[]>(initialTickets);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTickets(tickets);
    } else {
      const filtered = tickets.filter(ticket =>
        ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.creatorId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.categoryId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.headDepartmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTickets(filtered);
    }
  }, [searchTerm, tickets]);

  const handleDelete = async (ticketId: string) => {
    if (globalThis.confirm("Are you sure you want to delete this ticket? This action cannot be undone.")) {
      try {
        setTickets(tickets.filter((ticket) => ticket.id !== ticketId));
        setFilteredTickets(filteredTickets.filter((ticket) => ticket.id !== ticketId));
      } catch (error) {
        console.error("Failed to delete ticket:", error);
      }
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedTickets = () => {
    if (!sortField) return filteredTickets;

    return [...filteredTickets].sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "title":
          aValue = a.title || "";
          bValue = b.title || "";
          break;
        case "priority": {
          const priorityOrder = { "Low": 1, "Medium": 2, "High": 3, "Critical": 4 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        }
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
  };

  const handleEdit = (ticketId: string) => {
    setEditingTicketId(ticketId);
  };

  const handleView = (ticketId: string) => {
    // Handle view ticket details
    console.log("View ticket:", ticketId);
  };

  const handleCloseModal = () => {
    setEditingTicketId(null);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-900 text-red-300";
      case "High":
        return "bg-orange-900 text-orange-300";
      case "Medium":
        return "bg-yellow-900 text-yellow-300";
      case "Low":
        return "bg-green-900 text-green-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang thực hiện":
        return "bg-blue-900 text-blue-300";
      case "Chờ phê duyệt":
        return "bg-yellow-900 text-yellow-300";
      case "Hoàn thành":
        return "bg-green-900 text-green-300";
      case "Đã hủy":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  return (
    <main className="text-gray-900">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <FontAwesomeIcon icon={faTicket} className="text-blue-600" />
            Ticket Management
          </h1>
          <button
            onClick={handleOpenAddModal}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add New Ticket</span>
          </button>
        </div>

        {/* Search and filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tickets by title, creator, category, department or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 pl-10 block w-full bg-white border border-gray-300 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Filter button for mobile */}
            <div className="md:hidden">
              <button
                onClick={toggleFilterMenu}
                className="w-full bg-white border border-gray-300 text-gray-700 p-2 rounded flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faFilter} />
                <span>Filters</span>
              </button>
            </div>

            {/* Sort controls */}
            <div className={`md:flex items-center justify-end gap-2 ${isFilterMenuOpen ? 'block' : 'hidden md:flex'}`}>
              <span className="text-sm text-gray-600">Sort by:</span>
              <div className="flex flex-wrap gap-1 mt-2 md:mt-0">
                {[
                  { field: "title", label: "Title" },
                  { field: "priority", label: "Priority" },
                  { field: "status", label: "Status" },
                  { field: "createdAt", label: "Date" }
                ].map((item) => (
                  <button
                    key={item.field}
                    onClick={() => handleSort(item.field)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center ${sortField === item.field
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                  >
                    {item.label}
                    {sortField === item.field && (
                      <FontAwesomeIcon
                        icon={sortDirection === "asc" ? faSortUp : faSortDown}
                        className="ml-1.5"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-2xl mr-3" />
            <span className="text-lg">Loading tickets...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider font-medium text-gray-700">ID</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider font-medium text-gray-700">Titles</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider font-medium text-gray-700">CategoryID</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider font-medium text-gray-700">CreatorID</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider font-medium text-gray-700">HeadDepartmentID</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider font-medium text-gray-700">Content</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider font-medium text-gray-700">Priority</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider font-medium text-gray-700">CreatedAt</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getSortedTickets().map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 text-sm font-mono">{ticket.id}</td>
                    
                    <td className="px-4 py-3">
                      <div className="max-w-xs">
                        <div className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                          {ticket.title}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                        {ticket.categoryId}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                        {ticket.creatorId}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded text-xs">
                        {ticket.headDepartmentId}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="max-w-xs truncate text-gray-700 text-sm">
                        {ticket.content}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(ticket.id)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md p-2 transition-colors"
                          title="View"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => handleEdit(ticket.id)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md p-2 transition-colors"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                        <button
                          onClick={() => handleDelete(ticket.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 rounded-md p-2 transition-colors"
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTickets.length === 0 && (
              <div className="text-center p-8 text-gray-500">
                <FontAwesomeIcon icon={faTicket} className="text-5xl mb-4 opacity-30" />
                <p>No tickets found</p>
                <p className="text-sm mt-2">{searchTerm ? "Try a different search term" : "Add your first ticket"}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal Placeholder */}
      {editingTicketId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Ticket {editingTicketId}</h2>
              <p className="text-gray-700 mb-4">Edit ticket functionality will be implemented here.</p>
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal Placeholder */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Ticket</h2>
              <p className="text-gray-700 mb-4">Add ticket functionality will be implemented here.</p>
              <button
                onClick={handleCloseAddModal}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TicketManagement;
