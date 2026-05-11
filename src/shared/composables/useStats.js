import { computed, ref } from 'vue'
import { useGameStore } from '@/entities/games/store.js'
import { useStudiosStore } from '@/entities/studio/store.js'
import { usePublishersStore } from '@/entities/publisher/store.js'
import { useCategoriesStore } from '@/entities/category/store.js'
import { useNewsStore } from '@/entities/news/store.js'

export function useHeroStats() {
    const gameStore = useGameStore()
    const studiosStore = useStudiosStore()
    const publishersStore = usePublishersStore()
    const categoriesStore = useCategoriesStore()
    const newsStore = useNewsStore()

    const isLoading = ref(false)

    const stats = computed(() => [
        { label: 'Игр в каталоге', value: gameStore.items?.length || 0, icon: 'game' },
        { label: 'Студий', value: studiosStore.items?.length || 0, icon: 'studio' },
        { label: 'Издательств', value: publishersStore.items?.length || 0, icon: 'publisher' },
        { label: 'Жанров', value: categoriesStore.items?.length || 0, icon: 'tag' },
        { label: 'Новостей', value: newsStore.items?.length || 0, icon: 'news' }
    ])

    async function fetchAll() {
        if (isLoading.value) return
        isLoading.value = true

        try {
            const fetches = []
            if (!gameStore.items?.length) fetches.push(gameStore.fetchItems())
            if (!studiosStore.items?.length) fetches.push(studiosStore.fetchItems())
            if (!publishersStore.items?.length) fetches.push(publishersStore.fetchItems())
            if (!categoriesStore.items?.length) fetches.push(categoriesStore.fetchItems())
            if (!newsStore.items?.length) fetches.push(newsStore.fetchItems())

            await Promise.all(fetches)
        } catch (err) {
            console.error('Ошибка загрузки статистики:', err)
        } finally {
            isLoading.value = false
        }
    }

    return { stats, isLoading, fetchAll }
}