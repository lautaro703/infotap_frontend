import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const login = async (email, password) => {
    isLoading.value = true
    error.value = null
    try {
      if (!email || !password) {
        throw new Error('El correo y la contraseña son requeridos')
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('El correo no es válido')
      }
      const response = {
        token: `token_${Date.now()}`,
        user: {
          id: '1',
          email: email,
          name: email.split('@')[0]
        }
      }

      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      return response
    } catch (err) {
      error.value = err.message || 'Error al iniciar sesión'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    error.value = null
  }

  const register = async (email, password, confirmPassword) => {
    isLoading.value = true
    error.value = null
    try {
      if (!email || !password || !confirmPassword) {
        throw new Error('Todos los campos son requeridos')
      }

      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden')
      }

      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres')
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('El correo no es válido')
      }
      const response = {
        message: 'Usuario registrado exitosamente',
        user: {
          id: '1',
          email: email,
          name: email.split('@')[0]
        }
      }

      return response
    } catch (err) {
      error.value = err.message || 'Error al registrar usuario'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const recoverPassword = async (email) => {
    isLoading.value = true
    error.value = null
    try {
      if (!email) {
        throw new Error('El correo es requerido')
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('El correo no es válido')
      }
      const response = {
        message: 'Se envió un enlace de recuperación al correo'
      }

      return response
    } catch (err) {
      error.value = err.message || 'Error al recuperar contraseña'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    recoverPassword,
    initializeAuth
  }
})
