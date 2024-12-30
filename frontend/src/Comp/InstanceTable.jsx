import React, { useState } from 'react'
import SearchBar from './SearchBar'
import TableHeader from './TableHearder'
import TableRow from './TableRow'
import ExpandedRow from './ExpandedRow'
import { useSort } from '../Context/Sort'
import useSearch from '../Context/SearchHook'

const formatters = {
    date: (dateString) => {
        const date = new Date(dateString);
        // Explicitly format as DD-MM-YYYY
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
    // price: (price) => `$${price.toFixed(2)}`
};

const InstanceTable = ({ instances }) => {
    const [expandedRows, setExpandedRows] = useState(new Set());
    const { sortConfig, handleSort, sortedData } = useSort(instances);
    const { searchTerm, setSearchTerm, filteredData } = useSearch(sortedData);

    const toggleRowExpansion = (instanceId) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(instanceId)) {
            newExpandedRows.delete(instanceId);
        } else {
            newExpandedRows.add(instanceId);
        }
        setExpandedRows(newExpandedRows);
    };
    return (
        <div className="p-4">
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-900">
                <table className="min-w-full divide-y divide-gray-700">
                    <TableHeader
                        sortConfig={sortConfig}
                        onSort={handleSort}
                    />

                    <tbody className="divide-y divide-gray-700">
                        {filteredData.map((instance) => (
                            <React.Fragment key={instance.instance_id}>
                                <TableRow
                                    instance={instance}
                                    isExpanded={expandedRows.has(instance.instance_id)}
                                    onToggle={() => toggleRowExpansion(instance.instance_id)}
                                    formatDate={formatters.date}
                                    formatPrice={formatters.price}
                                />
                                {expandedRows.has(instance.instance_id) && (
                                    <ExpandedRow additionalInfo={instance} />
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                {filteredData.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No instances found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}

export default InstanceTable