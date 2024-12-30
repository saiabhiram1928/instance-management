import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../Context/AuthProvider'

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth()
    if (loading) return <h1>Loading ....</h1>
    return (
        isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
    )
}

export default ProtectedRoute