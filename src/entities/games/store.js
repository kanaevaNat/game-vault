import {defineStore} from "pinia";
import {api} from "@/entities/games/api.js";

export const useGameStore = defineStore('game', {
    state: () => ({
        games: [],
        currentGame:null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchGames() {
            this.loading = true
            try {
                this.games = await api.getAll()
            }
            catch (err) {
                this.error = err.message
            }
            finally {
                this.loading = false
            }
        }
    }
})