// API Base URL
const API_BASE_URL = 'http://localhost:5105';

// Helper function to get auth token
const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};

// Helper function to create headers with auth
const createAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

// API endpoints
export const API_ENDPOINTS = {
    // Authentication
    LOGIN: `${API_BASE_URL}/auth/login`,
    GOOGLE_LOGIN: `${API_BASE_URL}/auth/google-login`,
    GOOGLE_CALLBACK: `${API_BASE_URL}/auth/google-callback`,
    
    // Ticket endpoints
    TICKET_CREATE: `${API_BASE_URL}/Ticket/create`,
    TICKET_ASSIGN: `${API_BASE_URL}/Ticket/assign`,
    TICKET_REJECT: `${API_BASE_URL}/Ticket/reject`,
    
    // User endpoints
    USER_CREATE: `${API_BASE_URL}/user/create`,
    USER_UPDATE: `${API_BASE_URL}/user/update`,
    USER_BY_DEPARTMENT: `${API_BASE_URL}/user/get_by_department`,
    
    // Department endpoints
    DEPARTMENT_CREATE: `${API_BASE_URL}/department/create`,
    DEPARTMENT_UPDATE: `${API_BASE_URL}/department/update`,
    DEPARTMENT_DELETE: `${API_BASE_URL}/department/delete`,
    DEPARTMENT_GET_ALL: `${API_BASE_URL}/department/get_all`,
    DEPARTMENT_GET_BY_ID: `${API_BASE_URL}/department/get_by_id`,
};

// ==================== Authentication APIs ====================

// Google Login API
export const getGoogleAuthUrl = async (): Promise<string> => {
    try {
        const response = await fetch(API_ENDPOINTS.GOOGLE_LOGIN);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const url = await response.text();
        
        if (url.startsWith('http')) {
            return url;
        }
        
        try {
            const data = JSON.parse(url);
            return data.data || data;
        } catch {
            return url;
        }
    } catch (error) {
        console.error('Failed to get Google auth URL:', error);
        throw error;
    }
};

// Regular Login API
export const login = async (username: string, password: string) => {
    try {
        const response = await fetch(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// ==================== Ticket APIs (CRUD) ====================

export interface CreateTicketDto {
    title: string;
    categoryId: number;
    content: string;
    priority: string; // "Low" | "Medium" | "High" | "Critical"
    base64Files?: string[];
}

export interface AssignTicketDto {
    assigneeId: number;
    ticketId: number;
    note: string;
}

export interface RejectTicketDto {
    ticketId: number;
    reason: string;
}

// Create Ticket
export const createTicket = async (ticketData: CreateTicketDto) => {
    try {
        const response = await fetch(API_ENDPOINTS.TICKET_CREATE, {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify(ticketData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create ticket');
        }

        return await response.json();
    } catch (error) {
        console.error('Create ticket error:', error);
        throw error;
    }
};

// Assign Ticket
export const assignTicket = async (assignData: AssignTicketDto) => {
    try {
        const response = await fetch(API_ENDPOINTS.TICKET_ASSIGN, {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify(assignData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to assign ticket');
        }

        return await response.json();
    } catch (error) {
        console.error('Assign ticket error:', error);
        throw error;
    }
};

// Reject Ticket
export const rejectTicket = async (rejectData: RejectTicketDto) => {
    try {
        const response = await fetch(API_ENDPOINTS.TICKET_REJECT, {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify(rejectData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to reject ticket');
        }

        return await response.json();
    } catch (error) {
        console.error('Reject ticket error:', error);
        throw error;
    }
};

// ==================== User APIs (CRUD) ====================

export interface CreateUserDto {
    departmentId: number;
    fullName: string;
    email: string;
    role: string; // "Admin" | "User" | "Head Of IT" | "Head Of QA"
}

export interface UpdateUserDto {
    id: number;
    departmentId?: number;
    username?: string;
    fullName?: string;
    role?: string;
}

// Create User (Admin only)
export const createUser = async (userData: CreateUserDto) => {
    try {
        const response = await fetch(API_ENDPOINTS.USER_CREATE, {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create user');
        }

        return await response.json();
    } catch (error) {
        console.error('Create user error:', error);
        throw error;
    }
};

// Update User (Admin only)
export const updateUser = async (userData: UpdateUserDto) => {
    try {
        const response = await fetch(API_ENDPOINTS.USER_UPDATE, {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user');
        }

        return await response.json();
    } catch (error) {
        console.error('Update user error:', error);
        throw error;
    }
};

// Get Users by Department
export const getUsersByDepartment = async (departmentId: number) => {
    try {
        const response = await fetch(
            `${API_ENDPOINTS.USER_BY_DEPARTMENT}?departmentId=${departmentId}`,
            {
                method: 'GET',
                headers: createAuthHeaders(),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch users');
        }

        return await response.json();
    } catch (error) {
        console.error('Get users by department error:', error);
        throw error;
    }
};

// ==================== Department APIs (Full CRUD - Admin Only) ====================

export interface Department {
    id: number;
    name: string;
    description?: string;
}

export interface CreateDepartmentDto {
    name: string;
    description?: string;
}

export interface UpdateDepartmentDto {
    id: number;
    name: string;
    description?: string;
}

// Get All Departments
export const getAllDepartments = async (): Promise<Department[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.DEPARTMENT_GET_ALL, {
            method: 'GET',
            headers: createAuthHeaders(),
        });

        if (!response.ok) {
            // Read response once and handle it
            const contentType = response.headers.get('content-type');
            let errorMessage = `HTTP ${response.status}: Failed to fetch departments`;
            
            if (contentType && contentType.includes('application/json')) {
                try {
                    const error = await response.json();
                    errorMessage = error.message || error.title || errorMessage;
                } catch {
                    // If JSON parsing fails, use default message
                }
            } else {
                try {
                    const errorText = await response.text();
                    if (errorText) errorMessage = `HTTP ${response.status}: ${errorText}`;
                } catch {
                    // Use default message
                }
            }
            
            throw new Error(errorMessage);
        }

        const result = await response.json();
        // Handle different response formats
        if (result.data) return result.data;
        if (Array.isArray(result)) return result;
        if (result.success && result.data) return result.data;
        return [];
    } catch (error) {
        console.error('Get all departments error:', error);
        throw error;
    }
};

// Get Department by ID
export const getDepartmentById = async (departmentId: number): Promise<Department> => {
    try {
        const response = await fetch(
            `${API_ENDPOINTS.DEPARTMENT_GET_BY_ID}?departmentId=${departmentId}`,
            {
                method: 'GET',
                headers: createAuthHeaders(),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch department');
        }

        const result = await response.json();
        return result.data || result;
    } catch (error) {
        console.error('Get department by ID error:', error);
        throw error;
    }
};

// Create Department (Admin only)
export const createDepartment = async (departmentData: CreateDepartmentDto) => {
    try {
        const response = await fetch(API_ENDPOINTS.DEPARTMENT_CREATE, {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify(departmentData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create department');
        }

        return await response.json();
    } catch (error) {
        console.error('Create department error:', error);
        throw error;
    }
};

// Update Department (Admin only)
export const updateDepartment = async (departmentData: UpdateDepartmentDto) => {
    try {
        const response = await fetch(API_ENDPOINTS.DEPARTMENT_UPDATE, {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify(departmentData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update department');
        }

        return await response.json();
    } catch (error) {
        console.error('Update department error:', error);
        throw error;
    }
};

// Delete Department (Admin only)
export const deleteDepartment = async (departmentId: number) => {
    try {
        const response = await fetch(
            `${API_ENDPOINTS.DEPARTMENT_DELETE}?departmentId=${departmentId}`,
            {
                method: 'DELETE',
                headers: createAuthHeaders(),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete department');
        }

        return await response.json();
    } catch (error) {
        console.error('Delete department error:', error);
        throw error;
    }
};
