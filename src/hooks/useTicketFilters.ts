import { useState, useEffect, useMemo } from 'react';

interface UseTicketFiltersProps<T> {
    tickets: T[];
    searchFields: (keyof T)[];
}

interface FilterOptions {
    priority?: string;
    status?: string;
    category?: string;
}

export function useTicketFilters<T extends Record<string, any>>({
    tickets,
    searchFields
}: UseTicketFiltersProps<T>) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    
    // Filter states
    const [selectedPriority, setSelectedPriority] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    // Get unique values for filter dropdowns
    const uniquePriorities = useMemo(() => 
        [...new Set(tickets.map(t => t.priority).filter(Boolean))],
        [tickets]
    );

    const uniqueStatuses = useMemo(() => 
        [...new Set(tickets.map(t => t.status).filter(Boolean))],
        [tickets]
    );

    const uniqueCategories = useMemo(() => 
        [...new Set(tickets.map(t => String(t.categoryId)).filter(Boolean))],
        [tickets]
    );

    // Apply filters
    const filteredTickets = useMemo(() => {
        let result = tickets;

        // Apply search filter
        if (searchTerm.trim() !== "") {
            result = result.filter(ticket => {
                return searchFields.some(field => {
                    const value = ticket[field];
                    if (value === null || value === undefined) return false;
                    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
                });
            });
        }

        // Apply priority filter
        if (selectedPriority) {
            result = result.filter(ticket => ticket.priority === selectedPriority);
        }

        // Apply status filter
        if (selectedStatus) {
            result = result.filter(ticket => ticket.status === selectedStatus);
        }

        // Apply category filter
        if (selectedCategory) {
            result = result.filter(ticket => String(ticket.categoryId) === selectedCategory);
        }

        return result;
    }, [tickets, searchTerm, selectedPriority, selectedStatus, selectedCategory, searchFields]);

    // Apply sorting
    const sortedTickets = useMemo(() => {
        if (!sortField) return filteredTickets;

        return [...filteredTickets].sort((a, b) => {
            let aValue: any = a[sortField];
            let bValue: any = b[sortField];

            // Handle priority sorting with custom order
            if (sortField === "priority") {
                const priorityOrder: { [key: string]: number } = { 
                    "Thấp": 1,
                    "Low": 1,
                    "Trung bình": 2,
                    "Medium": 2,
                    "Cao": 3,
                    "High": 3,
                    "Critical": 4
                };
                aValue = priorityOrder[aValue] || 0;
                bValue = priorityOrder[bValue] || 0;
            }

            // Handle date sorting
            if (sortField === "createdAt" || sortField.includes("date") || sortField.includes("Date")) {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            // String comparison
            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortDirection === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            // Numeric comparison
            return sortDirection === "asc"
                ? (aValue as number) - (bValue as number)
                : (bValue as number) - (aValue as number);
        });
    }, [filteredTickets, sortField, sortDirection]);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const toggleFilterMenu = () => {
        setIsFilterMenuOpen(!isFilterMenuOpen);
    };

    const clearFilters = () => {
        setSelectedPriority("");
        setSelectedStatus("");
        setSelectedCategory("");
        setSearchTerm("");
        setSortField(null);
        setSortDirection("asc");
    };

    const hasActiveFilters = () => {
        return !!(searchTerm || selectedPriority || selectedStatus || selectedCategory);
    };

    return {
        // Filtered and sorted data
        sortedTickets,
        
        // Search state
        searchTerm,
        setSearchTerm,
        
        // Filter states
        selectedPriority,
        setSelectedPriority,
        selectedStatus,
        setSelectedStatus,
        selectedCategory,
        setSelectedCategory,
        
        // Sort states
        sortField,
        sortDirection,
        handleSort,
        
        // UI states
        isFilterMenuOpen,
        toggleFilterMenu,
        
        // Actions
        clearFilters,
        hasActiveFilters,
        
        // Unique values for dropdowns
        uniquePriorities,
        uniqueStatuses,
        uniqueCategories,
        
        // Metadata
        totalCount: tickets.length,
        filteredCount: sortedTickets.length
    };
}
