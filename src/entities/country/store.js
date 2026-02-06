import {defineStore} from "pinia";
import api from '@/shared/api/axios.js'

export const useCountriesStore = defineStore('country', {
    state: () => ({
        countries: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchCountries(){
            try{
                const response = await api.get('/countries/')
                this.countries = response.data
            }
            catch (error){
                console.error('Ошибка загрузки стран: ', error)
            }
        },
        async deleteCountry(id){
            try {
                await api.delete(`/countries/${id}/`)
                this.countries = this.countries.filter(c => c.id !== id)
            } catch (error) {
                throw error
            }
        }
    }
})