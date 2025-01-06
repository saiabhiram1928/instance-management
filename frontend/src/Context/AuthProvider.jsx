import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/check-auth`, {
          method: 'GET',
          credentials: "include"
        })
        if (!res.ok) {
          setIsAuthenticated(false)
          return
        }
        const data = await res.json()
        setIsAuthenticated(data.authenticated)
      } catch (error) {
        console.log(`Auth failed occur : ${error?.message}`)
        console.error(error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => {
  return useContext(AuthContext)
}
export default AuthProvider