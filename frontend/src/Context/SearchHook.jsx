import { useState, useMemo } from 'react';

const useSearch = (data) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;

        const lowercaseSearch = searchTerm.toLowerCase();
        return data.filter(item =>
            (item.name || '').toLowerCase().includes(lowercaseSearch) ||
            item.instance_id.toLowerCase().includes(lowercaseSearch) ||
            item.instance_type.toLowerCase().includes(lowercaseSearch)
        );
    }, [data, searchTerm]);

    return { searchTerm, setSearchTerm, filteredData };
};
export default useSearch
