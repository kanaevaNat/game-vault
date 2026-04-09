import {defineStore} from 'pinia'
import api from '@/shared/api/axios.js'
import {formatRelativeDate, formatShortDate} from '@/shared/utils/dateFormatter.js'
import {buildFormData} from '@/shared/utils/formDataBuilder.js'

export const useNewsStore = defineStore('news', {
    state: () => ({
        items: [],
        currentNews: null,
        loading: false,
        error: null,
        searchQuery: '',
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
    getters: {
        filteredNews: (state) => {
            if (!state.searchQuery.trim()) {
                return state.items
            }
            const query = state.searchQuery.toLowerCase()
            return state.items.filter(news => news.title.toLowerCase().includes(query))
        },

        filteredNewsWithRelativeDate() {
            return this.filteredNews.map(item => ({
                ...item,
                relativeDate: formatRelativeDate(item.created_at)
            }))
        }
    },
    actions: {
        async fetchItems() {
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/news/')
                this.items = response.data.map(item => ({
                    ...item,
                    relativeDate: formatRelativeDate(item.created_at)
                }))
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
        },

        async fetchItemById(id) {
            this.loading = true;
            try {
                const response = await api.get(`/news/${id}/`);
                this.currentNews = {
                    ...response.data,
                    relativeDate: formatRelativeDate(response.data.created_at)
                };
                return this.currentNews;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        findItemById(id) {
            return this.items.find(item => item.id == id)
        },
    }
})