import {defineStore} from "pinia";

export const useAdminStore = defineStore('admin', {
    state:() => ({
        isLoginModal: false,
    }),
    actions: {
        openLogin() {
            this.isLoginModal = true
        },
        closeLogin() {
            this.isLoginModal = false
        }
    }
})