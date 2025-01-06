import React from 'react'
import ChevronUp from './ChevronUp'
import ChevronDown from './ChevronDown'

const TableRow = ({ instance, isExpanded, onToggle, formatDate, formatPrice }) => {
    return (
        <tr
            className="hover:bg-gray-800 cursor-pointer transition-colors"
            onClick={onToggle}
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    {isExpanded ?
                        <ChevronUp className="h-4 w-4 mr-2 text-blue-400" /> :
                        <ChevronDown className="h-4 w-4 mr-2 text-blue-400" />
                    }
                    <span className="text-gray-100">
                        {instance.name || 'Unnamed Instance'}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-300">{instance.instance_id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-300">{instance.instance_type}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-300">{formatDate(instance.launch_time)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-300">{instance.price}</td>

        </tr>
    )
}

export default TableRow