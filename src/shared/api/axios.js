import axios from "axios";
import {useAdminStore} from "@/entities/admin/store.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout:10000
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Token ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            const adminStore = useAdminStore()
            adminStore.token = null
            adminStore.user = null
            adminStore.error = null
            adminStore.openLogin()
        }
        return Promise.reject(error)
    }
)
export default api