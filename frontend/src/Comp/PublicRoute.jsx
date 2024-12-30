import React from 'react'
import { useAuth } from '../Context/AuthProvider'
import { Outlet, Navigate } from 'react-router-dom'

const PublicRoute = () => {
    const { isAuthenticated, loading } = useAuth()
    if (loading) return <h1>Loading ....</h1>

    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}

export default PublicRoute