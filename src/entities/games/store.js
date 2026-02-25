import {defineStore} from "pinia";
import api from '@/shared/api/axios.js'
import {useStudiosStore} from "@/entities/studio/store.js";
import {usePublishersStore} from "@/entities/publisher/store.js";
import {useCategoriesStore} from "@/entities/category/store.js";
import {buildFormData} from "@/shared/utils/formDataBuilder.js";

export const useGameStore = defineStore('game', {
    state: () => ({
        items: [],
        currentGame:null,
        loading: false,
        error: null,
        searchQuery: '',
        headers: [
            {key: 'id', title: 'ID'},
            {key: 'name', title: 'Название'},
            {key: 'studio_details.name', title: 'Студия'},
            {key: 'publisher_details.name', title: 'Издатель'},
            {
                key: 'categories_details',
                title: 'Категории',
                sortable: false,
                value: item => {
                    const categories = item.categories_details
                    if (!categories || !Array.isArray(categories)) return '—'
                    return categories.map(c => c.name).join(', ')
                }
            },
            {key: 'release_year', title: 'Год'},
            {key: 'dls_count', title: 'DLC'},
            {key: 'preview', title: 'Превью', sortable: false, value: item => item.preview ? '✓' : '—'},
        ],
        formFields: [
            {
                key: 'name',
                label: 'Название игры',
                type: 'text',
                validation: {
                    required: true,
                    minLength: 2,
                    maxLength: 50
                }
            },
            {
                key: 'description',
                label: 'Содержимое',
                type: 'textarea',
                validation: {
                    required: true,
                    minLength: 10
                }
            },
            {
                key: 'studio',
                label: 'Студия',
                component: 'select',
                items: [],
                itemTitle: 'name',
                itemValue: 'id',
                validation: {
                    required: true
                }
            },
            {
                key: 'publisher',
                label: 'Издатель',
                component: 'select',
                items: [],
                itemTitle: 'name',
                itemValue: 'id',
                validation: {
                    required: true
                }
            },
            {
                key: 'categories',
                label: 'Категории',
                component: 'multiselect',
                items: [],
                itemTitle: 'name',
                itemValue: 'id',
                validation: {
                    required: true
                }
            },
            {
                key: 'release_year',
                label: 'Год',
                type: 'text',
                validation: {
                    required: true,
                    integer: true
                }
            },
            {
                key: 'dls_count',
                label: 'DLC',
                type: 'text',
                validation: {
                    required: true,
                    integer: true
                }
            },
            {
                key: 'preview',
                label: 'Изображение',
                type: 'file',
                accept: 'image/*',
                validation: {
                    required: false
                }
            },
        ]

    }),
    getters: {
        filteredGames: (state) => {
            if (!state.searchQuery.trim()) {
                return state.items
            }
            const query = state.searchQuery.toLowerCase()
            return state.items.filter(game => game.name.toLowerCase().includes(query))
        }
    },
    actions: {
        async fetchItems() {
            this.loading = true
            try {
                const response = await api.get('/games')
                this.items = response.data
                const studiosStore = useStudiosStore()
                const publishersStore = usePublishersStore()
                const categoriesStore = useCategoriesStore()
                if (studiosStore.items.length === 0) {
                    await studiosStore.fetchItems()
                }
                const studioFields = this.formFields.find(f => f.key === 'studio')
                if (studioFields){
                    studioFields.items = studiosStore.items
                }
                if (publishersStore.items.length === 0) {
                    await publishersStore.fetchItems()
                }
                const publisherFields = this.formFields.find(f => f.key === 'publisher')
                if (publisherFields){
                    publisherFields.items = publishersStore.items
                }
                if (categoriesStore.items.length === 0) {
                    await categoriesStore.fetchItems()
                }
                const categoriesFields = this.formFields.find(f => f.key === 'categories')
                if (categoriesFields){
                    categoriesFields.items = categoriesStore.items
                }

            }
            catch (error) {
                console.error('Ошибка загрузки игр:', error)
            }
            finally {
                this.loading = false
            }
        },
        async createItem(data) {
            const formData = buildFormData(data)
            const response = await api.post('/games/', formData)
            this.items.push(response.data)
            return response.data
        },

        async updateItem(id, data) {
            const formData = buildFormData(data)
            const response = await api.put(`/games/${id}/`, formData)
            const index = this.items.findIndex(item => item.id === id)
            if (index !== -1) this.items[index] = response.data
            return response.data
        },

        async deleteItem(id) {
            await api.delete(`/games/${id}/`)
            this.items = this.items.filter(item => item.id !== id)
        },

        setSearchQuery(query) {
            this.searchQuery = query
        }
    }
})