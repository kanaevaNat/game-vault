import {defineStore} from "pinia";
import api from "@/shared/api/axios.js";
import {useCountriesStore} from "@/entities/country/store.js";
import { formatDateForApi } from "@/shared/utils/dateFormatter.js";

export const usePublishersStore = defineStore('publisher', {
    state: () => ({
        items: [],
        loading: false,
        error: null,
        headers: [
            {key: 'id', title: 'ID'},
            {key: 'name', title: 'Название'},
            {key: 'country_details.name', title: 'Страна'},
            {key: 'founded', title: 'Дата основания'}
        ],
        formFields: [
            {
                key: 'name',
                label: 'Название издателя',
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
            },
            {
                key: 'founded',
                label: 'Дата основания',
                type: 'date',
                validation: {
                    required: true
                }
            }
        ],
    }),
    actions: {
        async fetchItems() {
            try {
                const response = await api.get('/publisher/')
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
                console.error('Ошибка загрузки издателей:', error)
            }
        },
        async createItem(data) {
            const payload = {
                ...data,
                founded: formatDateForApi(data.founded)
            }
            const response = await api.post('/publisher/', payload)
            this.items.push(response.data)
        },
        async updateItem(id, data) {
            const payload = {
                ...data,
                founded: formatDateForApi(data.founded)
            }
            const response = await api.put(`/publisher/${id}/`, payload)
            const index = this.items.findIndex(item => item.id === id)
            if (index !== -1) {
                this.items[index] = response.data
            }
        },
        async deleteItem(id) {
            await api.delete(`/publisher/${id}/`)
            this.items = this.items.filter(item => item.id !== id)
        },
    }
})