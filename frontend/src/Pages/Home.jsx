import React, { useEffect } from 'react'
import InstanceTable from '../Comp/InstanceTable';
import Loader from '../Comp/Loader';
import ErrorTab from '../Comp/ErrorTab';
import { usePagination } from '../Context/PaginationHook.jsx'
import Pagination from '../Comp/Pagination.jsx'
import { useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get('page')) || 1;
    const itemsPerPage = parseInt(queryParams.get('size')) || 10;


    const { loading, instances, error, totalItems, totalPages } = usePagination(currentPage, itemsPerPage);
    console.log(instances, totalItems, totalPages)
    const handlePageChange = (page) => {
        console.log(page)
        navigate(`/home?page=${page}&size=${itemsPerPage}`);
    };

    const handleItemsPerPageChange = (newSize) => {
        navigate(`/home?page=1&size=${newSize}`, { replace: true });
    };
    useEffect(() => {
        if (location.pathname === '/home' && !location.search) {
            console.log(location.search)
            navigate('/home?page=1&size=10', { replace: true });
        }
    }, [location, navigate]);
    if (loading) return <Loader />
    return (
        <div className="bg-gray-900 text-white min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-center my-5">Instance Management</h1>
                <ErrorTab error={error} />
                <div className="mt-6">
                    <InstanceTable instances={instances} />
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            </div>
        </div>
    )
}

export default Home