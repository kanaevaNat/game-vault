import {defineStore} from "pinia";
import api from '@/shared/api/axios.js'

export const useAdminStore = defineStore('admin', {
    state:() => ({
        isLoginModal: false,
        token: null,
        user: null,
        isLoading: false,
        error: null,
        initialized: false,
        loginForm: {
            username: '',
            password: ''
        }
    }),
    getters: {
        isAuthenticated: (state) => !!state.token
    },
    actions: {
        async login() {
            this.isLoading = true
            this.error = null
            try {
                const response = await api.post('/token/auth/', this.loginForm)
                const token = response.data.token
                this.token = token
                localStorage.setItem('token', token)
                await this.fetchUser()
                this.closeLogin()

                return true
            } catch (error) {
                this.error = error.response?.data?.message || 'Ошибка входа'
                return false
            } finally {
                this.isLoading = false
            }
        },

        async fetchUser(){
          try {
              const response = await api.get('/current_user')
              this.user = response.data
          }  catch (error) {
              console.error('Ошибка загрузки пользователя: ', error)
              this.logout()
          }
        },

        async initialize() {
            if (this.initialized) return

            const token = localStorage.getItem('token')
            if (token) {
                this.token = token
                await this.fetchUser()
            }
            this.initialized = true
        },

        resetLoginForm() {
            this.loginForm = {
                username: '',
                password: ''
            }
            this.error = null
        },

        logout() {
            this.token = null
            this.user = null
            this.error = null
            this.isLoginModal = false
            localStorage.removeItem('token')
        },

        openLogin() {
            this.isLoginModal = true
        },

        closeLogin() {
            this.isLoginModal = false
        }
    }
})