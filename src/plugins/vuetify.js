import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import {
    VApp,
    VMain,
    VTable,
    VNavigationDrawer,
    VList,
    VListItem,
    VListItemTitle,
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
        VApp,
        VMain,
        VTable,
        VNavigationDrawer,
        VList,
        VListItem,
        VListItemTitle,
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
        defaultTheme: 'dark',
    },
    defaults: {
        global: { ripple: false }
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi
        }
    }
})