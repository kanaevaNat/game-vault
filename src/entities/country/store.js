import {defineStore} from "pinia";
import api from '@/shared/api/axios.js'

export const useCountriesStore = defineStore('country', {
    state: () => ({
        items: [],
        loading: false,
        error: null,
        columns: [
            {key: 'id', label: 'ID'},
            {key: 'name', label: 'Название'}
        ],
        formFields: [
            {
                key: 'name',
                label: 'Название страны',
                type: 'text',
                rules: [v => !!v || 'Обязательное поле']
            }
        ]
    }),
    actions: {
        async fetchItems(){
            console.log('fetchItems called!')
            try{
                const response = await api.get('/countries/')
                this.items = response.data
            }
            catch (error){
                console.error('Ошибка загрузки стран: ', error)
            }
        },
        async deleteItem(id){
            try {
                await api.delete(`/countries/${id}/`)
                this.items = this.items.filter(c => c.id !== id)
            } catch (error) {
                throw error
            }
        },
        async createItem(data) {
            const response = await api.post('/countries/', data)
            this.items.push(response.data)
        },

        async updateItem(id, data) {
            const response = await api.put(`/countries/${id}/`, data)
            const index = this.items.findIndex(item => item.id === id)
            if (index !== -1) {
                this.items[index] = response.data
            }
        }
    }
})