import {defineStore} from "pinia";
import api from '@/shared/api/axios.js'

export const useGameStore = defineStore('game', {
    state: () => ({
        games: [],
        currentGame:null,
        loading: false,
        error: null,
        searchQuery: '',
    }),
    getters: {
        filteredGames: (state) => {
            if (!state.searchQuery.trim()) {
                return state.games
            }
            const query = state.searchQuery.toLowerCase()
            return state.games.filter(game => game.name.toLowerCase().includes(query))
        }
    },
    actions: {
        async fetchGames() {
            this.loading = true
            try {
                const response = await api.get('/games')
                this.games = response.data
            }
            catch (err) {
                this.error = err.message
            }
            finally {
                this.loading = false
            }
        },

        setSearchQuery(query) {
            this.searchQuery = query
        }
    }
})