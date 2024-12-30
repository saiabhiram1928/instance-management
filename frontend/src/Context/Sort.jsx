
import { useState, useMemo } from 'react';

export const useSort = (data) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            // Handle empty or undefined name fields
            if (sortConfig.key === 'name') {
                const aVal = a[sortConfig.key] || 'Unnamed Instance';
                const bVal = b[sortConfig.key] || 'Unnamed Instance';
                return sortConfig.direction === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }

            // Handle date sorting for launch_time
            if (sortConfig.key === 'launch_time') {
                const aDate = new Date(a[sortConfig.key]);
                const bDate = new Date(b[sortConfig.key]);
                return sortConfig.direction === 'asc'
                    ? aDate - bDate
                    : bDate - aDate;
            }

            // Default string comparison for other fields
            return sortConfig.direction === 'asc'
                ? a[sortConfig.key].localeCompare(b[sortConfig.key])
                : b[sortConfig.key].localeCompare(a[sortConfig.key]);
        });
    }, [data, sortConfig]);

    return { sortedData, sortConfig, handleSort };
};