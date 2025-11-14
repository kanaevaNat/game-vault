import { createVuetify } from 'vuetify'
import {
    VBtn,
    VTextField,
    VTextarea,
    VSelect,
    VCard,
    VCardText,
    VCardActions,
    VDialog,
    VSnackbar
} from 'vuetify/components'

export default createVuetify({
    components: {
        VBtn,
        VTextField,
        VTextarea,
        VSelect,
        VCard,
        VCardText,
        VCardActions,
        VDialog,
        VSnackbar
    },
    theme: {
        defaultTheme: 'light', // или 'custom'
        themes: {
            light: {
                dark: false,
                colors: {}
            }
        }
    },
    defaults: {
        global: { ripple: false }
    }
})