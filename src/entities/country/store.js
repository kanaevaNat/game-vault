import { defineStore } from 'pinia'
import api from '@/shared/api/axios.js'

export const useCountriesStore = defineStore('country', {
    state: () => ({
        items: [],
        loading: false,
        error: null,
        columns: [
            { key: 'id', title: 'ID', sortable: true, align: 'center', width: '80px' },
            { key: 'name', title: 'Название', sortable: true }
        ],
        formFields: [
            {
                key: 'name',
                label: 'Название страны',
                type: 'text',
                validation: {
                    required: true,
                    minLength: 2,
                    maxLength: 50
                }
            }
        ],
        tableState: null,
    }),

    actions: {
        async fetchItems() {
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/countries/')
                this.items = response.data
            } catch (error) {
                this.error = error.message
                console.error('Ошибка загрузки стран:', error)
            } finally {
                this.loading = false
            }
        },
        async deleteItem(id) {
            try {
                await api.delete(`/countries/${id}/`)
                this.items = this.items.filter(c => c.id !== id)
            } catch (error) {
                console.error('Ошибка удаления:', error)
                throw error
            }
        },
        async createItem(data) {
            const response = await api.post('/countries/', data)
            this.items.push(response.data)
            return response.data
        },
        async updateItem(id, data) {
            try {
                const response = await api.put(`/countries/${id}/`, data)
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