import React from 'react'
import ChevronUp from './ChevronUp';
import ChevronDown from './ChevronDown';

const TableHearder = ({ sortConfig, onSort }) => {
    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key === columnKey) {
            return sortConfig.direction === 'asc' ?
                <ChevronUp className="inline ml-1 h-4 w-4 text-blue-400" /> :
                <ChevronDown className="inline ml-1 h-4 w-4 text-blue-400" />;
        }
        return null;
    };

    const headerCells = [
        { key: 'name', label: 'Instance Name' },
        { key: 'instance_id', label: 'Instance ID' },
        { key: 'instance_type', label: 'Type' },
        { key: 'launch_time', label: 'Launch Time' }
    ];
    return (
        <thead className="bg-gray-800">
            <tr>
                {headerCells.map(({ key, label }) => (
                    <th
                        key={key}
                        onClick={() => onSort(key)}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-blue-400 transition-colors"
                    >
                        {label}
                        <SortIcon columnKey={key} />
                    </th>
                ))}
            </tr>
        </thead>
    );
}

export default TableHearder