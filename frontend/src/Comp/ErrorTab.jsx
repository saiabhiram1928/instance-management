import React from 'react'
import AlertCircle from './AlertCircle'


const ErrorTab = ({ error }) => {
    if (error == null) return null
    console.log(error)
    return (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2">
                <AlertCircle className="text-red-500 size-6" />
                <p className="text-red-400">{error}</p>
            </div>
        </div>
    )
}

export default ErrorTab