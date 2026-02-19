import {defineStore} from 'pinia'
import api from '@/shared/api/axios.js'
import {formatShortDate} from '@/shared/utils/dateFormatter.js'
import {buildFormData} from '@/shared/utils/formDataBuilder.js'

export const useNewsStore = defineStore('news', {
    state: () => ({
        items: [],
        loading: false,
        error: null,

        headers: [
            {key: 'id', title: 'ID', width: '80px'},
            {key: 'title', title: 'Заголовок'},
            {key: 'image', title: 'Изображение', sortable: false, value: item => item.image ? '✓' : '—'},
            {key: 'created_at', title: 'Дата', value: item => formatShortDate(item.created_at)},
        ],

        formFields: [
            {
                key: 'title',
                label: 'Заголовок',
                type: 'text',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 200
                }
            },
            {
                key: 'content',
                label: 'Содержимое',
                type: 'textarea',
                validation: {
                    required: true,
                    minLength: 10
                }
            },
            {
                key: 'image',
                label: 'Изображение',
                type: 'file',
                accept: 'image/*',
                validation: {
                    required: false
                }
            },
        ],

        tableState: null,
    }),

    actions: {
        async fetchItems() {
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/news/')
                this.items = response.data
            } catch (error) {
                this.error = error.message
                console.error('Ошибка загрузки новостей:', error)
            } finally {
                this.loading = false
            }
        },

        async createItem(data) {
            const formData = buildFormData(data)
            const response = await api.post('/news/', formData)
            this.items.push(response.data)
            return response.data
        },

        async updateItem(id, data) {
            const formData = buildFormData(data)
            const response = await api.put(`/news/${id}/`, formData)
            const index = this.items.findIndex(item => item.id === id)
            if (index !== -1) this.items[index] = response.data
            return response.data
        },

        async deleteItem(id) {
            await api.delete(`/news/${id}/`)
            this.items = this.items.filter(item => item.id !== id)
        }
    }
})