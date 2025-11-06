import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faFile, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import { API_CONFIG } from "../../config/api";

interface ICategory {
    id: number;
    name: string;
}

interface IProject {
    id: number;
    name: string;
}

const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

const getLocalISOString = () => {
    const date = new Date();
    const tzoffset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
    return localISOTime;
};

const CreateTicket = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState<number | string>("");
    const [priority, setPriority] = useState("Medium");
    const [desiredCompleteDate, setDesiredCompleteDate] = useState(getLocalISOString());
    const [projectId, setProjectId] = useState<number | string>("");
    const [content, setContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [projects, setProjects] = useState<IProject[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const catResponse = await fetch(`${API_CONFIG.baseUrl}/Category/get_all`, {
                    headers: {Authorization: `Bearer ${API_CONFIG.getToken()}`}
                });
                if (!catResponse.ok) throw new Error("Failed to fetch categories");
                const catResult = await catResponse.json();
                if (catResult.success) setCategories(catResult.data);

                const projResponse = await fetch(`${API_CONFIG.baseUrl}/Project/get_all`, {
                    headers: {Authorization: `Bearer ${API_CONFIG.getToken()}`}
                });
                if (!projResponse.ok) throw new Error("Failed to fetch projects");
                const projResult = await projResponse.json();
                if (projResult.success) setProjects(projResult.data);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (fileName: string) => {
        setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title || !categoryId || !priority || !desiredCompleteDate || !content) {
            setError("Vui lòng điền tất cả các trường bắt buộc.");
            return;
        }

        setLoading(true);

        try {
            const base64Promises = selectedFiles.map(convertFileToBase64);
            const base64Files = await Promise.all(base64Promises);

            const createTicketRequest = {
                title,
                categoryId: Number(categoryId),
                priority,
                content,
                desiredCompleteDate: new Date(desiredCompleteDate).toISOString(),
                projectId: projectId ? Number(projectId) : null,
                base64Files: base64Files
            };

            const response = await fetch(`${API_CONFIG.baseUrl}/Ticket/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_CONFIG.getToken()}`
                },
                body: JSON.stringify(createTicketRequest)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                if (errorData && errorData.error && errorData.error.description) {
                    throw new Error(errorData.error.description);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                navigate("/user/tickets");
            } else {
                setError(result.error?.description || result.error || "An unknown error occurred.");
            }
        } catch (err: any) {
            console.error('Error creating ticket:', err);
            setError(`Failed to create ticket: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white max-w-4xl mx-auto rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tạo yêu cầu mới</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Danh mục <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                            Mức độ ưu tiên <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                        >
                            <option value="Medium">Trung bình</option>
                            <option value="High">Cao</option>
                            <option value="Low">Thấp</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="desiredCompleteDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày mong muốn hoàn thành <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="desiredCompleteDate"
                            value={desiredCompleteDate}
                            onChange={(e) => setDesiredCompleteDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                            Dự án (Nếu có)
                        </label>
                        <select
                            id="project"
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                        >
                            <option value="">-- Không thuộc dự án nào --</option>
                            {projects.map(proj => (
                                <option key={proj.id} value={proj.id}>{proj.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="content"
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="Mô tả chi tiết yêu cầu của bạn..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tệp đính kèm
                    </label>
                    <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md border border-gray-300 p-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                        <FontAwesomeIcon icon={faUpload} />
                        <span>Chọn tệp để tải lên</span>
                    </label>
                    <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleFileChange}
                    />

                    {selectedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {selectedFiles.map(file => (
                                <div key={file.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <FontAwesomeIcon icon={faFile} className="text-gray-500" />
                                        <span>{file.name}</span>
                                        <span className="text-gray-400 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(file.name)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Gửi yêu cầu"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTicket;