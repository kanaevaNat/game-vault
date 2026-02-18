import { computed } from 'vue'

export function useTableState(store, options = {}) {
    const {
        defaultPerPage = 10,
        resetOnSearch = true
    } = options

    if (!store.tableState) {
        store.tableState = {
            search: '',
            page: 1,
            itemsPerPage: defaultPerPage,
            sortBy: [],
        }
    }

    const search = computed({
        get: () => store.tableState.search,
        set: (value) => {
            store.tableState.search = value
            if (resetOnSearch && value !== store.tableState.search) {
                store.tableState.page = 1
            }
        }
    })

    const page = computed({
        get: () => store.tableState.page,
        set: (value) => { store.tableState.page = value }
    })

    const itemsPerPage = computed({
        get: () => store.tableState.itemsPerPage,
        set: (value) => {
            store.tableState.itemsPerPage = value
            store.tableState.page = 1
        }
    })

    const sortBy = computed({
        get: () => store.tableState.sortBy,
        set: (value) => { store.tableState.sortBy = value }
    })

    const resetTableState = () => {
        store.tableState = {
            search: '',
            page: 1,
            itemsPerPage: defaultPerPage,
            sortBy: [],
        }
    }

    const updateTableState = (newState) => {
        store.tableState = { ...store.tableState, ...newState }
    }

    return {
        search,
        page,
        itemsPerPage,
        sortBy,
        resetTableState,
        updateTableState
    }
}