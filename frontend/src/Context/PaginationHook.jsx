import { useState, useEffect } from 'react';
import fetchInstanceDetails from './InstanceProvider';

export const usePagination = (currentPage, itemsPerPage) => {
    const [loading, setLoading] = useState(true);
    const [instances, setInstances] = useState([]);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchInstanceDetails(currentPage, itemsPerPage);
                setInstances(response.instances);
                setTotalItems(response.total);
                setTotalPages(response.total_pages);
                setError(null);
            } catch (err) {
                setError(err.message || 'Error occurred while fetching instances');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage]);

    return { loading, instances, error, totalItems, totalPages };
};
