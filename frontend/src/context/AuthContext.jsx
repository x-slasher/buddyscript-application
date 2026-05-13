import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('auth_user')
            if (!stored || stored === 'undefined') return null
            return JSON.parse(stored)
        } catch (e) {
            localStorage.removeItem('auth_user')
            localStorage.removeItem('auth_token')
            return null
        }
    })

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/user/login', { email, password })
            localStorage.setItem('auth_token', data.token)
            localStorage.setItem('auth_user', JSON.stringify(data.data)) // ← data.data not data.user
            setUser(data.data)
            return data
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message)
            throw err
        }
    }

    const register = async (form) => {
        const { data } = await api.post('/user/register', form)
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(data.data))
        setUser(data.data)
        return data
    }

    const logout = async () => {
        try {
            await api.post('/user/logout')
        } catch (e) {
            // token already invalid, proceed anyway
        }
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}