import {defineStore} from "pinia";
import api from '@/shared/api/axios.js'

export const useCategoriesStore = defineStore('category', {
    state: () => ({
        items: [],
        loading: false,
        error: null,
        headers: [
            {key: 'id', title: 'ID', sortable: true},
            {key: 'name', title: 'Название', sortable: true}
        ],
        formFields: [
            {
                key: 'name',
                label: 'Название категории',
                type: 'text',
                validation: {
                    required: true,
                    minLength: 2,
                    maxLength: 50
                }
            }
        ],
        tableState: null
    }),
    actions: {
        async fetchItems() {
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/categories/')
                this.items = response.data
            } catch (error) {
                this.error = error.message
                console.error('Ошибка загрузки категорий:', error)
            } finally {
                this.loading = false
            }
        },
        async deleteItem(id) {
            try {
                await api.delete(`/categories/${id}/`)
                this.items = this.items.filter(c => c.id !== id)
            } catch (error) {
                console.error('Ошибка удаления:', error)
                throw error
            }
        },
        async createItem(data) {
            const response = await api.post('/categories/', data)
            this.items.push(response.data)
            return response.data
        },
        async updateItem(id, data) {
            try {
                const response = await api.put(`/categories/${id}/`, data)
                const index = this.items.findIndex(item => item.id === id)
                if (index !== -1) {
                    this.items[index] = response.data
                }
                return response.data
            } catch (error) {
                console.error('Ошибка обновления:', error)
                throw error
            }
        }
    }
})