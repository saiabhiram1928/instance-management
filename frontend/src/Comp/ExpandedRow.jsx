import React from 'react'

const ExpandedRow = ({ additionalInfo }) => {
    return (
        <tr className="bg-gray-800 bg-opacity-50">
            <td colSpan="4" className="px-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(additionalInfo).map(([key, value]) => (
                        <div key={key} className="border-l-2 border-gray-700 pl-3">
                            <p className="font-semibold text-gray-300">{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.slice(1)}:</p>
                            <p className='text-gray-400'>{value}</p>
                        </div>
                    ))}
                </div>
            </td>
        </tr>
    )
}

export default ExpandedRow