import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './Pages/login'
import Home from './Pages/Home'
import ProtectedRoute from './Comp/ProtectedRoute'
import Signup from './Pages/Signup'
import Router from './Router'
import AuthProvider from './Context/AuthProvider'
import PublicRoute from './Comp/PublicRoute'

const App = () => {
  return (
    <AuthProvider>
      <main className='bg-gray-900 text-white min-h-screen w-full fixed inset-0 overflow-auto'>
        <Routes>
          <Route element={<Router />}>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path='/' element={<Navigate to={`/home?page=1&size=10`} replace />} />
              <Route path='/home' element={<Home />} />
            </Route>
          </Route>
        </Routes>
      </main>
    </AuthProvider>
  )
}

export default App