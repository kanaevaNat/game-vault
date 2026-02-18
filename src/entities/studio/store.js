import {defineStore} from "pinia";
import api from "@/shared/api/axios.js";
import {useCountriesStore} from "@/entities/country/store.js";

export const useStudiosStore = defineStore('studio', {
    state: () => ({
        items: [],
        loading: false,
        error: null,
        headers: [
            {key: 'id', title: 'ID'},
            {key: 'name', title: 'Название'},
            {key: 'country_details.name', title: 'Страна'}
        ],
        formFields: [
            {
                key: 'name',
                label: 'Название студии',
                type: 'text',
                validation: {
                    required: true,
                    minLength: 2,
                    maxLength: 50
                }
            },
            {
                key: 'country',
                label: 'Страна',
                component: 'select',
                items: [],
                itemTitle: 'name',
                itemValue: 'id',
                validation: {
                    required: true
                }
            }],
        countriesStore: useCountriesStore(),
    }),
    actions: {
        async fetchItems() {
            try {
                const response = await api.get('/studios/')
                this.items = response.data
                const countriesStore = useCountriesStore()
                if (countriesStore.items.length === 0) {
                    await countriesStore.fetchItems()
                }
                const countryField = this.formFields.find(f => f.key === 'country')
                if (countryField) {
                    countryField.items = countriesStore.items
                }
            } catch (error) {
                console.error('Ошибка загрузки студий:', error)
            }
        },
        async createItem(data) {
            const response = await api.post('/studios/', data)
            this.items.push(response.data)
        },
        async updateItem(id, data) {
            const response = await api.put(`/studios/${id}/`, data)
            const index = this.items.findIndex(item => item.id === id)
            if (index !== -1) {
                this.items[index] = response.data
            }
        },
        async deleteItem(id) {
            await api.delete(`/studios/${id}/`)
            this.items = this.items.filter(item => item.id !== id)
        },

    }
})