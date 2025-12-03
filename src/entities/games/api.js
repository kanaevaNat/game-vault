import {apiClient} from "@/plugins/axios.js";
/**
 * @typedef {Object} Game
 * @property {number} id
 * @property {string} name
 * @property {Studio} studio
 * @property {Publisher} publisher
 * @property {number} release_year
 * @property {number} dls_count
 * @property {string | null} preview
 */
export const api = {
    async getAll() {
        const res = await apiClient.get('/games')
        return res.data
    }
}