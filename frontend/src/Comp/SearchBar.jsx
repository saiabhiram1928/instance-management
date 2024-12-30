import React from 'react'
import Search from './Search'

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="mb-4 relative">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search instances..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
        </div>
    )
}

export default SearchBar